import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { Types } from 'mongoose';
import { Pagination } from '../../dto';
import { MainValidationPipe } from '../../pipes';
import { ProfileInsertDto, ProfileStatusDto } from './dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @UsePipes(new MainValidationPipe())
  @Post('new')
  insertProxy(@Body() body: ProfileInsertDto) {
    return this.service.insertProfile(body);
  }

  @UsePipes(new MainValidationPipe())
  @Patch('change-status')
  statusProxy(@Param('id') id: string, @Body() body: ProfileStatusDto) {
    if (Types.ObjectId.isValid(id)) return this.service.updateStatus(id, body.status);
    throw new BadRequestException([{ field: 'id', message: 'Id invalid' }]);
  }

  @UsePipes(new MainValidationPipe())
  @Get('list')
  getList(@Query() query: Pagination) {
    return this.service.getProfileList(query);
  }
}
