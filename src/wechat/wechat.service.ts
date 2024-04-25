import { Injectable } from '@nestjs/common';
import { PrismaClient, WechatAccount } from '@prisma/client';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { AppWechatConfig, WechatSession } from './types';

@Injectable()
export class WechatService {
  private js2sessionUrl = 'https://api.weixin.qq.com/sns/jscode2session';

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaClient,
  ) {}

  async _js2session(code: string): Promise<WechatSession> {
    const config = this.configService.getOrThrow<AppWechatConfig>('wechat');
    const res = await axios.get(this.js2sessionUrl, {
      params: {
        appid: config.appid,
        secret: config.secret,
        js_code: code,
        grant_type: 'authorization_code',
      },
    });
    if (res.status >= 400) {
      console.log(res);
      throw new Error('微信服务器错误');
    }
    const data = JSON.parse(res.data);
    if (data.errcode) {
      console.log(data);
      throw new Error('微信服务器错误');
    }
    return {
      openid: data.openid,
      sessionKey: data.session_key,
      unionid: data.unionid,
    };
  }

  async getAccountWithCode(code: string): Promise<WechatAccount> {
    const session = await this._js2session(code);
    const account = await this.prisma.wechatAccount.findUnique({
      where: {
        openid: session.openid,
      },
    });
    if (account) {
      return this.prisma.wechatAccount.update({
        data: {
          sessionKey: session.sessionKey,
        },
        where: {
          openid: session.openid,
        },
      });
    } else {
      return this.prisma.wechatAccount.create({
        data: {
          openid: session.openid,
          sessionKey: session.sessionKey,
          unionId: session.unionid,
        },
      });
    }
  }
}
