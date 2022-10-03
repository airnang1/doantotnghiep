import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RoleResponseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}
