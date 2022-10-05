import { IsBoolean, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { Order } from '../../../constants';
import { Pagination } from '../../../dto';

export class ChannelRequestDto {
  @IsOptional()
  @IsString()
  channelId: string;

  @IsOptional()
  @IsString()
  topicId: string;

  @IsOptional()
  @IsString()
  clientId: string;

  @IsOptional()
  @IsString()
  clientGoogle: string;

  @IsOptional()
  @IsString()
  secretGoogle: string;

  @IsOptional()
  @IsString()
  refreshToken: string;

  @IsOptional()
  @IsString()
  accessToken: string;

  @IsOptional()
  @IsNumber()
  duration: number;

  @IsOptional()
  @IsBoolean()
  other: boolean;
}

export class ChannelSearchDto extends Pagination {
  @IsOptional()
  @IsString()
  keyword: string;

  @IsOptional()
  @IsString()
  sortKey: string;

  @IsOptional()
  @IsIn([Order.ASC, Order.DESC])
  sortOrder: string;
}
