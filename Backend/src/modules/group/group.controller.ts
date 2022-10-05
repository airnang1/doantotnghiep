import { BadRequestException, Body, Controller, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { MainValidationPipe, ParseObjectIdPipe } from '../../pipes';
import { GroupDto, GroupResponseDto, YearDto } from './dto';
import { GroupService } from './group.service';

@Controller('crm/group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('')
  @UsePipes(new MainValidationPipe())
  async createGroup(@Body() body: GroupResponseDto) {
    return this.groupService.createGroup(body);
  }

  @Get('')
  @UsePipes(new MainValidationPipe())
  async findAll(@Query() query: GroupDto) {
    return this.groupService.getAllGroup(query);
  }

  @Get(':id/clients')
  @UsePipes(new MainValidationPipe())
  getClientsByGroup(@Param('id') id: string, @Query() query: GroupDto) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException([{ fields: 'Param', message: `Params is invalid` }]);
    return this.groupService.getClientsByGroup(id, query);
  }

  @Get(':id/servers')
  @UsePipes(new MainValidationPipe())
  getServersByGroup(@Param('id') id: string, @Query() query: GroupDto) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException([{ fields: 'Param', message: `Params is invalid` }]);
    return this.groupService.getServersByGroup(id, query);
  }

  @Get(':id/channels')
  @UsePipes(new MainValidationPipe())
  getChannelsByGroup(@Param('id') id: string, @Query() query: GroupDto) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException([{ fields: 'Param', message: `Params is invalid` }]);
    return this.groupService.getChannelsByGroup(id, query);
  }

  @Get(':id/monthly-revenue')
  @UsePipes(new MainValidationPipe())
  getMonthlyRevenueByGroup(@Param('id') id: string, @Query() query: YearDto) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException([{ fields: 'Param', message: `Params is invalid` }]);
    return this.groupService.getMonthlyRevenueByGroup(id, query);
  }

  @Get('drop-down')
  getGroupForDropdown() {
    return this.groupService.getGroupForDropdown();
  }

  @Get(':id')
  getGroupById(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.groupService.getGroupById(id);
  }
}
