import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Pagination } from '../../../dto';

export class SpotifyResponseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  url: string;
}

export class SpotifySearchDto extends Pagination {
  @IsOptional()
  @IsString()
  keyword: string;
}
