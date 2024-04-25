import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { AppUser } from '@prisma/client';
import { stringGen } from '../utils/string.util';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppUserDto, LoginSuccessDto, MobilePasswordLoginCmd, WechatLoginCmd } from './types';
import { BusinessError } from '../error/business-error';
import { businessErrorInfos } from './error';
import { AuthService } from '../auth/auth.service';
import { AppUserService } from './app-user.service';
import { Auth } from '../auth/auth';
import { AppSession } from '../auth/types';
import { appUserMixin } from './app-user';

@Controller('app-users')
export class AppUserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: AppUserService,
  ) {}

  async loginSuccess(user: AppUser): Promise<LoginSuccessDto> {
    const apiKey = stringGen(64);
    const ttl = 60 * 60 * 24 * 30;
    const expires = Date.now() + ttl * 1000;
    await this.authService.replaceSession(
      {
        userId: user.uid,
        mobile: user.mobile,
        token: apiKey,
        expires,
      },
      ttl,
    );
    return {
      apiKey,
      expires,
      user: appUserMixin.toDto.call(user),
    };
  }

  @ApiOperation({ summary: '登录' })
  @ApiResponse({ type: LoginSuccessDto })
  @Post('login')
  async login(@Body() cmd: MobilePasswordLoginCmd) {
    const user = await this.userService.getUserByMobile(cmd.mobile);
    if (!user) {
      throw new BusinessError(businessErrorInfos.userNotFound);
    }
    const match = await appUserMixin.validatePassword.call(user, cmd.password);
    if (!match) {
      throw new BusinessError(businessErrorInfos.invalidPassword);
    }

    return this.loginSuccess(user);
  }

  @ApiOperation({ summary: '注册' })
  @ApiResponse({ type: LoginSuccessDto })
  @Post('register')
  async register(@Body() cmd: MobilePasswordLoginCmd) {
    const u = await this.userService.getUserByMobile(cmd.mobile);
    if (u) {
      throw new BusinessError(businessErrorInfos.userAlreadyExists);
    }
    const user = await this.userService.createUser(cmd.mobile, cmd.password);
    return this.loginSuccess(user);
  }

  @ApiOperation({ summary: '微信登录' })
  @ApiResponse({ type: LoginSuccessDto })
  @Post('login-by-wechat')
  async loginByWechat(@Body() cmd: WechatLoginCmd) {
    const user = await this.userService.loginWithWechatSessionCode(cmd.code);
    return this.loginSuccess(user);
  }

  @Auth()
  @ApiOperation({ summary: '获取我的信息' })
  @ApiResponse({ type: AppUserDto })
  @Get('my-info')
  async myInfo(@Session() session: AppSession) {
    const user = await this.userService.getUser(session.userId);
    return appUserMixin.toDto.call(user);
  }
}
