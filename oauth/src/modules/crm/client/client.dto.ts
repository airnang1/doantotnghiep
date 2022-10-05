import { IsNotEmpty, IsNumber, IsOptional, Length, Max, MaxLength } from 'class-validator';

export class ClientRequestDto {
  @MaxLength(255)
  @IsOptional()
  name: string;

  @MaxLength(255)
  @IsOptional()
  location: string;

  @Length(24, 24)
  @IsOptional()
  groupId: string;

  @MaxLength(100)
  @IsNotEmpty()
  username: string;

  @MaxLength(250)
  @IsNotEmpty()
  password: string;

  @Max(9999)
  @IsNumber()
  @IsOptional()
  serverCount: number;

  @IsNumber()
  @IsOptional()
  profitRatio: number;
}
