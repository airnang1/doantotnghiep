import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IPDto, ProxyStatus } from '../../../dto';

export class ProxyInsertDto extends IPDto {
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  username: string;

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ProxyStatusDto extends IPDto {
  @IsEnum(ProxyStatus)
  @IsNotEmpty()
  status: ProxyStatus;
}

export class ProxyQueryDto {
  @IsOptional()
  @IsString()
  type: string;
}
