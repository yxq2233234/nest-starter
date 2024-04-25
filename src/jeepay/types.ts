import { IsNotEmpty, IsString } from 'class-validator';

export class AppJeepayConfig {
  @IsString()
  @IsNotEmpty()
  mchNo: string;
  @IsString()
  @IsNotEmpty()
  appId: string;
  @IsString()
  @IsNotEmpty()
  host: string;
  @IsString()
  @IsNotEmpty()
  key: string;
}
