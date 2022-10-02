import { Prisma } from '@prisma/client';
import { IsAlphanumeric, IsIn, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { PaginationDto } from '../../../../dto';

export class UserRequestDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  roleId: string;
}

export class UserSearchDto extends PaginationDto {
  @IsOptional()
  keyword: string;

  @IsOptional()
  sortKey: string;

  @ValidateIf(({ sortKey }: UserSearchDto) => !!sortKey)
  @IsIn([Prisma.SortOrder.asc, Prisma.SortOrder.desc])
  sortOrder: string;
}
