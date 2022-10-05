import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Pagination } from '../../../dto';

export class WebsiteResponseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  url: string;
}

export class WebsiteSearchDto extends Pagination {
  @IsOptional()
  @IsString()
  keyword: string;
}
