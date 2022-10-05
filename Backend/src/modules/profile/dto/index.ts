import { IsEmail, IsEnum, IsNotEmpty, MaxLength } from 'class-validator';
import { IPDto, ProxyStatus } from '../../../dto';

export class ProfileInsertDto extends IPDto {
  @MaxLength(100)
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ProfileStatusDto {
  @IsEnum(ProxyStatus)
  @IsNotEmpty()
  status: ProxyStatus;
}
