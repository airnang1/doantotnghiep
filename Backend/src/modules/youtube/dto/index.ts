import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Order } from '../../../constants';
import { Pagination } from '../../../dto';

export class YoutubeResponseDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
export class TopicDto extends Pagination {
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
