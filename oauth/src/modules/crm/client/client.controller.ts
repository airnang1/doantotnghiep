import { BadRequestException, Body, Controller, Delete, Param, Post, Query, UsePipes } from '@nestjs/common';
import { query } from 'express';
import { Public } from '../../../core/decorator';
import { MainValidationPipe } from '../../../pipes';
import { ClientRequestDto } from './client.dto';
import { ClientService } from './client.service';

@Controller('crm/client')
export class ClientController {
  constructor(private readonly service: ClientService) {}

  @Public()
  @Post()
  @UsePipes(new MainValidationPipe())
  async createClient(@Body() body: ClientRequestDto) {
    // Check username exist
    const existsUsername = await this.service.checkUserNameOfClient(body);
    if (existsUsername) throw new BadRequestException([{ field: 'username', message: 'Username is exists' }]);

    return this.service.createClient(body);
  }

  @Public()
  @Delete(':id')
  @UsePipes(new MainValidationPipe())
  deleteClient(@Param('id') id: string) {
    return this.service.deleteClient(id);
  }
}
