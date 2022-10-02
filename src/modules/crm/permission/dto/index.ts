import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PermissionRequestDto {
  @IsNotEmpty()
  @IsString()
  featureId: string;

  @IsNotEmpty()
  @IsString()
  roleId: string;

  @IsOptional()
  @IsBoolean()
  canView: boolean;

  @IsOptional()
  @IsBoolean()
  canCreate: boolean;

  @IsOptional()
  @IsBoolean()
  canEdit: boolean;

  @IsOptional()
  @IsBoolean()
  canDelete: boolean;
}
