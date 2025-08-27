import { Controller, Post, Body } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { GenerateScheduleRequestSchema, GenerateScheduleResponseSchema } from '@suppletime/shared-types';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('api/schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('generate')
  async generateSchedule(
    @Body(new ZodValidationPipe(GenerateScheduleRequestSchema))
    request: GenerateScheduleRequestSchema,
  ) {
    const schedule = await this.scheduleService.generateSchedule(request);
    return { schedule };
  }
}
