import { Module } from '@nestjs/common';
import { ReasonController } from './reason.controller';
import { ReasonService } from './reason.service';

@Module({
  controllers: [ReasonController],
  providers: [ReasonService],
})
export class ReasonModule {}
