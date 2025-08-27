import { Controller, Post, Body } from '@nestjs/common';
import { ReasonService } from './reason.service';
import { Schedule, SupplementInput } from '@suppletime/shared-types';

@Controller('reason')
export class ReasonController {
  constructor(private readonly reasonService: ReasonService) {}

  @Post('explain')
  async explainSchedule(
    @Body() data: { schedule: Schedule; supplements: SupplementInput[] },
  ): Promise<Schedule> {
    return this.reasonService.explainSchedule(data.schedule, data.supplements);
  }
}
