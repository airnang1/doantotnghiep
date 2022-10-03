import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChangePasswordDto {
  @MaxLength(250)
  @IsNotEmpty()
  oldPassword: string;

  @MaxLength(250)
  @IsNotEmpty()
  password: string;
}
