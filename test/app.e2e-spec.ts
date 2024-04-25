import { TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { createTestApp } from '../src/test';
import { PrismaClient } from '@prisma/client';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await createTestApp();
    prisma = moduleFixture.get(PrismaClient);
    await prisma.appUser.deleteMany();
    app = moduleFixture.createNestApplication(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/app-users/register (POST)', async () => {
    return request(app.getHttpServer())
      .post('/app-users/register')
      .send({
        mobile: '13800000000',
        password: '123456',
      })
      .expect(201);
  });
});
