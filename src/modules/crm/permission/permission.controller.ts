import { Body, Controller, Get, Param, Patch, Post, UsePipes } from '@nestjs/common';
import { MainValidationPipe } from '../../../pipes';
import { PermissionRequestDto } from './dto';
import { PermissionService } from './permission.service';

@Controller('crm/permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @UsePipes(new MainValidationPipe())
  createPermission(@Body() body: PermissionRequestDto[]) {
    return this.permissionService.createPermission(body);
  }

  @Get(':id/role')
  getPermissionByRole(@Param('id') id: string) {
    return this.permissionService.getPermissionByRole(id);
  }

  @Patch('update')
  @UsePipes(new MainValidationPipe({ skipMissingProperties: true }))
  updatePermission(@Body() body: PermissionRequestDto[]) {
    return this.permissionService.updatePermission(body);
  }
}
