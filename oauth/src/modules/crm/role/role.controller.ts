import { Body, Controller, Get, Param, Patch, Post, UsePipes } from '@nestjs/common';
import { MainValidationPipe } from '../../../pipes';
import { RoleResponseDto } from './dto';
import { RoleService } from './role.service';

@Controller('crm/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @UsePipes(new MainValidationPipe())
  async createRole(@Body() body: RoleResponseDto) {
    return this.roleService.createRole(body);
  }

  @Get()
  @UsePipes(new MainValidationPipe())
  async findAll() {
    return this.roleService.getRoles();
  }

  @Get('/:id')
  async getRole(@Param('id') id: string) {
    return this.roleService.getRole(id);
  }

  @Patch(':id')
  @UsePipes(new MainValidationPipe({ skipMissingProperties: true }))
  async updateRole(@Param('id') id: string, @Body() body: RoleResponseDto) {
    return this.roleService.updateRole(id, body);
  }
}
