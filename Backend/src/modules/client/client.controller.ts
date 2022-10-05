import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { isValidObjectId, Types } from 'mongoose';
import { MainValidationPipe, ParseObjectIdPipe } from '../../pipes';
import { ClientService } from './client.service';
import { ClientDto, ClientEditDto, ClientSearchDto } from './dto';

@Controller('crm/client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get('check-group/:id')
  async checkGroupIdOfClient(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException([{ field: 'groupId', message: 'Invalid GroupId' }]);
    return this.clientService.checkGroupIdOfClient(id);
  }

  @Get('check-exist/:username')
  async checkClientExist(@Param('username') username: string) {
    return this.clientService.checkUserNameOfClient(username);
  }

  @Post('new')
  async createClient(@Body() body: ClientDto) {
    const isExistUserName = await this.clientService.checkUserNameOfClient(body.username);
    if (isExistUserName) throw new BadRequestException([{ field: 'username', message: 'Username is exists' }]);

    return this.clientService.createClient(body);
  }

  @Get()
  @UsePipes(new MainValidationPipe())
  getAll(@Query() query: ClientSearchDto) {
    return this.clientService.getAll(query);
  }

  @Get(':id/servers')
  @UsePipes(new MainValidationPipe())
  getServersByClient(@Param('id') id: string, @Query() query: ClientSearchDto) {
    if (!isValidObjectId(id)) throw new BadRequestException([{ field: 'clientId', message: 'ClientId is invalid' }]);
    return this.clientService.getServersByClient(id, query);
  }

  @Get(':id/revenues')
  @UsePipes(new MainValidationPipe())
  getRevenuesByClient(@Param('id') id: string, @Query() query: ClientSearchDto) {
    if (!isValidObjectId(id)) throw new BadRequestException([{ field: 'clientId', message: 'ClientId is invalid' }]);
    return this.clientService.getRevenuesByClient(id, query);
  }

  @Get(':id')
  getClientById(@Param('id') id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException([{ field: 'clientId', message: 'ClientId is invalid' }]);
    return this.clientService.getClientById(id);
  }

  @Patch(':id')
  @UsePipes(new MainValidationPipe())
  editClient(@Param('id', ParseObjectIdPipe) id: ObjectId, @Body() body: ClientEditDto) {
    return this.clientService.editClient(id, body);
  }

  @Delete(':id')
  @UsePipes(new MainValidationPipe())
  deleteClient(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.clientService.deleteClient(id);
  }
}
