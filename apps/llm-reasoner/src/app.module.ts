import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReasonModule } from './reason/reason.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ReasonModule,
  ],
})
export class AppModule {}
