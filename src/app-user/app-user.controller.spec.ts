import { TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { createTestApp } from '../test';
import { AppUserController } from './app-user.controller';
import { WechatService } from '../wechat/wechat.service';

describe('AppUserController', () => {
  let controller: AppUserController;
  let wechatService: WechatService;
  let prisma: PrismaClient;
  let uid: number;
  let module: TestingModule;

  beforeAll(async () => {
    module = await createTestApp();

    prisma = module.get<PrismaClient>(PrismaClient);
    controller = module.get<AppUserController>(AppUserController);
    wechatService = module.get<WechatService>(WechatService);
    jest.spyOn(wechatService, '_js2session').mockImplementation((code: string) => {
      if (code === 'abcd1234') {
        return Promise.resolve({
          openid: 'abcd1234',
          unionid: 'abcd1234',
          sessionKey: 'abcd1234',
        });
      }
      return Promise.reject(new Error('Invalid code'));
    });
    await prisma.$executeRaw`TRUNCATE TABLE "AppUser"`;
    await prisma.appUser.create({
      data: {
        mobile: '13800138001',
        wxOpenid: 'abcd1234',
      },
    });
  });

  afterAll(async () => {
    return module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create user', async () => {
    const result = await controller.register({
      mobile: '13800138000',
      password: '123456',
    });
    uid = result.user.uid;
    expect(result).toBeDefined();
    expect(result.user.mobile).toBe('13800138000');
  });

  it('should login', async () => {
    const result = await controller.login({
      mobile: '13800138000',
      password: '123456',
    });
    uid = result.user.uid;
    expect(result).toBeDefined();
    expect(result.user.mobile).toBe('13800138000');
  });

  it('should login with wechat', async () => {
    const result = await controller.loginByWechat({
      code: 'abcd1234',
    });
    expect(result).toBeDefined();
    expect(result.user.mobile).toBe('13800138001');
  });

  it('should get user info', async () => {
    const user = await controller.myInfo({
      userId: uid,
      mobile: '13800138000',
      token: 'test',
      expires: Date.now() + 1000,
    });
    expect(user).toBeDefined();
    expect(user.mobile).toBe('13800138000');
  });
});
