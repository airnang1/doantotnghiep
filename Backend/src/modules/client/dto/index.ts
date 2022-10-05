import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Order } from '../../../constants';
import { Pagination } from '../../../dto';

export class ClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @IsNotEmpty()
  serverCount: number;

  @IsNumber()
  @IsNotEmpty()
  profitRatio: number;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ClientEditDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  location: string;
}

export class ClientSearchDto extends Pagination {
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
