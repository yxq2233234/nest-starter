import { IsNotEmpty } from 'class-validator';

export class AppEmailConfig {
  @IsNotEmpty()
  accessKey: string;
  @IsNotEmpty()
  accessSecret: string;
  @IsNotEmpty()
  host: string;
  @IsNotEmpty()
  port: number;
  @IsNotEmpty()
  secure: boolean;
  @IsNotEmpty()
  user: string;
  @IsNotEmpty()
  pass: string;
}
