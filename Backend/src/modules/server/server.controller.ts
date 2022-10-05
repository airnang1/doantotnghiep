import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { MainValidationPipe, ParseObjectIdPipe } from '../../pipes';
import { ServerDto, ServerEditDto, ServerRequestDto } from './dto';
import { ServerService } from './server.service';

@Controller('crm/server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Post()
  @UsePipes(new MainValidationPipe())
  createServer(@Body() server: ServerDto) {
    return this.serverService.createServer(server);
  }

  @Get()
  @UsePipes(new MainValidationPipe())
  getAll(@Query() query: ServerRequestDto) {
    return this.serverService.getAll(query);
  }

  @Get(':name')
  @UsePipes(new MainValidationPipe())
  getServerTerminateByName(@Param('name') name: string) {
    return this.serverService.getServerByName(name);
  }

  @Patch(':id')
  @UsePipes(new MainValidationPipe())
  editServer(@Param('id', ParseObjectIdPipe) id: ObjectId, @Body() body: ServerEditDto) {
    return this.serverService.editServer(id, body);
  }

  @Delete(':id')
  @UsePipes(new MainValidationPipe())
  deleteServer(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.serverService.deleteServer(id);
  }
}
