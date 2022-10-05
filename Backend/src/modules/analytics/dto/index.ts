import { IsOptional, IsString } from 'class-validator';

export class AnalyticRequestDto {
  @IsOptional()
  @IsString()
  accessToken: string;
}
