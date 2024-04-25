import { Test, TestingModule } from '@nestjs/testing';
import { JeepayService } from './jeepay.service';
import { ConfigModule } from '@nestjs/config';

describe('JeepayService', () => {
  let service: JeepayService;

  beforeAll(async () => {
    const config: any = {
      jeepay: {
        key: 'EWEFD123RGSRETYDFNGFGFGSHDFGH',
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [() => config],
        }),
      ],
      providers: [JeepayService],
    }).compile();

    service = module.get<JeepayService>(JeepayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('test sign', () => {
    const sign = service._sign({
      platId: '1000',
      mchOrderNo: 'P0123456789101',
      amount: '10000',
      clientIp: '192.168.0.111',
      returnUrl: 'https://www.baidu.com',
      notifyUrl: 'https://www.baidu.com',
      reqTime: '20190723141000',
      version: '1.0',
    });
    expect(sign).toBe('84E1CA56F984502BBAC06EA6707157F5');
  });
});
