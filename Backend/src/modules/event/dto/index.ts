import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Pagination } from '../../../dto';

export class EventResponseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  type: number;
}

export class EventSearchDto extends Pagination {
  @IsOptional()
  @IsString()
  keyword: string;
}
