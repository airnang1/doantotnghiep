import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateAccountFlagsDto {
  @IsOptional()
  isPremium: string | boolean;

  @IsOptional()
  @IsBoolean()
  mobileUsed: boolean;

  @IsOptional()
  @IsBoolean()
  pcUsed: boolean;

  @IsOptional()
  @IsBoolean()
  otherUsed: boolean;

  @IsOptional()
  @IsBoolean()
  error: boolean;
}

export class AccountsQueryDto {
  @IsString()
  @IsOptional()
  server: string;

  @IsString()
  @IsOptional()
  server_channel: string;
}
