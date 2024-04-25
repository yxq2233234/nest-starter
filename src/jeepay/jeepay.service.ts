import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import { AppJeepayConfig } from './types';

@Injectable()
export class JeepayService {
  private mchNo: string;
  private appId: string;
  private key: string;
  private host: string;

  constructor(private readonly configService: ConfigService) {
    const config = this.configService.getOrThrow<AppJeepayConfig>('jeepay');
    this.mchNo = config.mchNo;
    this.appId = config.appId;
    this.key = config.key;
    this.host = config.host;
  }

  _sign(params: Record<string, string | number>): string {
    const keys = Object.keys(params).sort();
    const query = keys
      .filter((it) => !!params[it])
      .map((key) => `${key}=${params[key]}`)
      .join('&');
    const data = query + '&key=' + this.key;
    console.log(data);
    return crypto.createHash('md5').update(data).digest('hex').toUpperCase();
  }

  async unifiedOrder(cmd: UnifiedOrderCmd) {
    const data: Record<string, any> = {
      amount: cmd.amount,
      mchOrderNo: cmd.mchOrderNo,
      subject: cmd.subject,
      wayCode: cmd.wayCode,
      reqTime: cmd.reqTime,
      body: cmd.body,
      channelExtra: JSON.stringify(cmd.channelExtra),
      clientIp: cmd.clientIp,
      notifyUrl: 'https://www.jeequan.com',
      returnUrl: '',
      extParam: '',
      version: '1.0',
      signType: 'MD5',
      currency: 'cny',
      appId: this.appId,
      mchNo: this.mchNo,
      divisionMode: 1,
    };
    data['sign'] = this._sign(data);
    const res = await axios.post(`${this.host}/api/pay/unifiedOrder`, data);
    return res.data;
  }
}

/**
 * https://docs.jeequan.com/docs/jeepay/payment_api#5pw28y
 */
export enum JeepayWayCode {
  // 聚合扫码(用户扫商家)
  QR_CASHIER = 'QR_CASHIER',
  // 支付宝条码
  ALI_BAR = 'ALI_BAR',
  // 支付宝生活号
  ALI_JSAPI = 'ALI_JSAPI',
  // 支付宝APP
  ALI_APP = 'ALI_APP',
  // 支付宝WAP
  ALI_WAP = 'ALI_WAP',
  // 支付宝PC网站
  ALI_PC = 'ALI_PC',
  // 支付宝二维码
  ALI_QR = 'ALI_QR',
  // 微信条码
  WX_BAR = 'WX_BAR',
  // 微信公众号
  WX_JSAPI = 'WX_JSAPI',
  // 微信小程序
  WX_LITE = 'WX_LITE',
  // 微信APP
  WX_APP = 'WX_APP',
  // 微信H5
  WX_H5 = 'WX_H5',
  // 微信扫码
  WX_NATIVE = 'WX_NATIVE',
  // 云闪付条码
  YSF_BAR = 'YSF_BAR',
  // 云闪付jsapi
  YSF_JSAPI = 'YSF_JSAPI',
}

export interface UnifiedOrderCmd {
  amount: number;
  mchOrderNo: string;
  // 商品名称
  subject: string;
  wayCode: JeepayWayCode;
  // 下单时间 13位时间戳
  reqTime: string;
  // 商品描述
  body: string;
  // 失效时间 单位秒
  expireTime: number;
  clientIp: string;
  channelExtra: any;
}
