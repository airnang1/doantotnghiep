import { IsOptional, IsString } from 'class-validator';

export class DesktopDeviceQueryDto {
  @IsString()
  @IsOptional()
  osType: string;
}
