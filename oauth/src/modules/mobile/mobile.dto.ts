import { IsNotEmpty, MaxLength } from 'class-validator';

export class AuthRequestDto {
  @MaxLength(100)
  @IsNotEmpty()
  username: string;

  @MaxLength(250)
  @IsNotEmpty()
  password: string;
}

export interface AuthInfo {
  id: string;
  username: string;
  groupId: string;
  clientId: string;
}
