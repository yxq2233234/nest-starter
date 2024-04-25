import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MobilePasswordLoginCmd {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class WechatLoginCmd {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class AppUserDto {
  @ApiProperty()
  uid: number;

  @ApiProperty()
  mobile: string;
}

export class LoginSuccessDto {
  @ApiProperty()
  apiKey: string;

  @ApiProperty()
  expires: number;

  @ApiProperty()
  user: AppUserDto;
}
