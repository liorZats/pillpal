import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateScheduleRequest, Schedule } from '@suppletime/shared-types';
import Redis from 'ioredis';
import axios from 'axios';

@Injectable()
export class ScheduleService {
  private readonly redis: Redis;

  constructor(private readonly prisma: PrismaService) {
    this.redis = new Redis(process.env.REDIS_URL);
  }

  async generateSchedule(request: GenerateScheduleRequest): Promise<Schedule> {
    try {
      // 1. Call Java engine service
      const engineResponse = await axios.post(
        `${process.env.ENGINE_URL}/engine/schedule`,
        request,
      );

      const baseSchedule = engineResponse.data;

      // 2. Call LLM Reasoner service for explanations
      const reasonerResponse = await axios.post(
        `${process.env.LLM_REASONER_URL}/reason/explain`,
        {
          schedule: baseSchedule,
          supplements: request.supplements,
        },
      );

      const annotatedSchedule = reasonerResponse.data;

      // 3. Persist schedule in database
      const schedule = await this.prisma.schedule.create({
        data: {
          date: new Date(),
          warnings: annotatedSchedule.warnings || [],
          slots: {
            create: annotatedSchedule.slots.map((slot) => ({
              time: slot.time,
              withMeal: slot.withMeal,
              mealType: slot.mealType,
              warnings: slot.warnings || [],
              items: {
                create: slot.supplements.map((item) => ({
                  supplementId: item.supplementId,
                  dose: item.dose,
                  note: item.note,
                })),
              },
            })),
          },
        },
        include: {
          slots: {
            include: {
              items: true,
            },
          },
        },
      });

      return schedule;
    } catch (error) {
      throw new HttpException(
        'Failed to generate schedule',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
