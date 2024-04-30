import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      inject: [ConfigService],
      provide: PrismaClient,
      useFactory: (configService: ConfigService) =>
        new PrismaClient({
          datasources: {
            db: {
              url: configService.get('db.url'),
            },
          },
        }),
    },
    PrismaService,
  ],
  exports: [PrismaClient],
})
export class PrismaModule {}
