import { IsIn, IsOptional, IsString } from 'class-validator';
import { Order } from '../../../constants';
import { Pagination } from '../../../dto';

export class PlaylistSearchDto extends Pagination {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  sortKey: string;

  @IsOptional()
  @IsIn([Order.ASC, Order.DESC])
  sortOrder: string;

  @IsOptional()
  @IsString()
  keyword: string;
}
