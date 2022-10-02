import { IsNotEmpty, IsString } from 'class-validator';

export class FeatureRequestDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
