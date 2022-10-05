import { IsBoolean, IsBooleanString, IsOptional, IsString } from 'class-validator';

export class UpdateCouponFlagsDto {
  @IsOptional()
  @IsBoolean()
  isUsed: boolean;
}

export class CouponsQueryDto {
  @IsString()
  @IsOptional()
  server: string;

  @IsBooleanString()
  @IsOptional()
  isUsed: string;
}
