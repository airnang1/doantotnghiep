import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Order } from '../../../constants';
import { Pagination } from '../../../dto';

export class GroupResponseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsNumber()
  clients: number;

  @IsNotEmpty()
  @IsNumber()
  server: number;

  @IsNotEmpty()
  @IsNumber()
  channel: number;

  @IsNotEmpty()
  @IsNumber()
  turnover: number;
}

export class GroupDto extends Pagination {
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
export class YearDto extends GroupDto {
  @IsOptional()
  @IsString()
  queryYear: string;
}
