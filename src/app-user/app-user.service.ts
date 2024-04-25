import { Injectable } from '@nestjs/common';
import { AppUser, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { WechatService } from '../wechat/wechat.service';

@Injectable()
export class AppUserService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly wechatService: WechatService,
  ) {}

  async createUser(mobile: string, password: string) {
    return this.prisma.appUser.create({
      data: {
        mobile,
        bcryptPassword: bcrypt.hashSync(password, 10),
      },
    });
  }

  getUser(uid: number) {
    return this.prisma.appUser.findUnique({
      where: {
        uid,
      },
    });
  }

  async getUserByMobile(mobile: string): Promise<AppUser> {
    return this.prisma.appUser.findUnique({
      where: {
        mobile,
      },
    });
  }

  async loginWithWechatSessionCode(code: string) {
    const wechat = await this.wechatService.getAccountWithCode(code);
    const user: AppUser = await this.prisma.appUser.findUnique({
      where: {
        wxOpenid: wechat.openid,
      },
    });
    if (user) return user;
    return this.prisma.appUser.create({
      data: {
        wxOpenid: wechat.openid,
      },
    });
  }
}
