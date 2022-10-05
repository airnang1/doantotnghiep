import { IsIn, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Order } from '../../../constants';
import { Pagination } from '../../../dto';

export class ServerDto {
  @IsNumber()
  @IsNotEmpty()
  count: number;

  @IsMongoId()
  clientId: string;
}

export class ServerEditDto {
  @IsNumber()
  @IsOptional()
  terminate: number;

  @IsNumber()
  @IsOptional()
  subscribe: number;

  @IsNumber()
  @IsOptional()
  status: number;
}

export class ServerRequestDto extends Pagination {
  @IsString()
  @IsOptional()
  sortKey: string;

  @IsIn([Order.ASC, Order.DESC])
  @IsOptional()
  sortOrder: string;

  @IsString()
  @IsOptional()
  keyword: string;
}
