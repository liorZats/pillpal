import { Injectable } from '@nestjs/common';
import { Schedule, SupplementInput } from '@suppletime/shared-types';
import Redis from 'ioredis';

@Injectable()
export class ReasonService {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
  }

  async explainSchedule(
    schedule: Schedule,
    supplements: SupplementInput[],
  ): Promise<Schedule> {
    // For MVP, use simple templating for explanations
    // Later, this will integrate with an actual LLM
    const annotatedSchedule = {
      ...schedule,
      slots: schedule.slots.map((slot) => ({
        ...slot,
        supplements: slot.supplements.map((item) => {
          const supplement = supplements.find((s) => s.id === item.supplementId);
          let note = '';

          if (supplement) {
            if (supplement.withFood && slot.withMeal) {
              note = `Take ${supplement.name} with this meal for better absorption.`;
            } else if (supplement.timing === 'AM' && this.isMorning(slot.time)) {
              note = `${supplement.name} is best taken in the morning for energy.`;
            } else if (supplement.timing === 'PM' && this.isEvening(slot.time)) {
              note = `${supplement.name} is best taken in the evening for relaxation.`;
            }
          }

          return {
            ...item,
            note: note || 'Take as directed.',
          };
        }),
      })),
    };

    return annotatedSchedule;
  }

  private isMorning(time: string): boolean {
    const hour = parseInt(time.split(':')[0]);
    return hour >= 5 && hour < 12;
  }

  private isEvening(time: string): boolean {
    const hour = parseInt(time.split(':')[0]);
    return hour >= 17 || hour < 5;
  }
}
