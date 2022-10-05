import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Pagination } from '../../../dto';

export class FacebookResponseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  url: string;
}

export class FacebookSearchDto extends Pagination {
  @IsOptional()
  @IsString()
  keyword: string;
}
