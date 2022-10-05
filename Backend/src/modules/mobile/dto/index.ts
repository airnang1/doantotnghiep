import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Pagination } from '../../../dto';

class ClientInfo extends Pagination {
  @IsNotEmpty()
  clientId: string;
  @IsOptional()
  groupId: string;
}

export class DashboardDto extends ClientInfo {
  @IsOptional()
  @IsNumber()
  year: number;

  @IsOptional()
  @IsNumber()
  month: number;
}

export class ChannelQueryDto extends ClientInfo {}

export class CostQueryDto extends ClientInfo {}
