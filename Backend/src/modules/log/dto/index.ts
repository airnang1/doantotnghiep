import { IsOptional, IsString } from 'class-validator';
import { Pagination } from '../../../dto';

export class LogSearchDto extends Pagination {
  @IsOptional()
  @IsString()
  keyword: string;
}
