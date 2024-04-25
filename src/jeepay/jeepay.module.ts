import { Module } from '@nestjs/common';
import { JeepayService } from './jeepay.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [JeepayService],
  exports: [JeepayService],
})
export class JeepayModule {}
