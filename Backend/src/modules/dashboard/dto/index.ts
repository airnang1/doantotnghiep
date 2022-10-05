import { IsNotEmpty, IsString } from 'class-validator';

export class DashboardDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
