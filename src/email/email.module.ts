import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StmpEmailService } from './stmp-email.service';

@Module({
  imports: [ConfigModule],
  providers: [StmpEmailService],
  exports: [StmpEmailService],
})
export class EmailModule {}
