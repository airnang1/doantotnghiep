import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { ProxyStatus } from '../../../dto';

export class MailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(ProxyStatus)
  @IsNotEmpty()
  status: ProxyStatus;
}
