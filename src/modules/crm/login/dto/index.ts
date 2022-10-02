import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class User {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  password: string;
}
