import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { MainValidationPipe } from '../../pipes';
import { EventResponseDto, EventSearchDto } from './dto';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly faceBookService: EventService) {}

  @Post()
  @UsePipes(new MainValidationPipe())
  async createEvent(@Body() body: EventResponseDto) {
    return this.faceBookService.createEvent(body);
  }

  @Get()
  @UsePipes(new MainValidationPipe())
  async findAll(@Query() query: EventSearchDto) {
    return this.faceBookService.getAllEvent(query);
  }

  @Get('/:id')
  async getEventById(@Param('id') id: string) {
    return this.faceBookService.getEventById(id);
  }

  @UsePipes(new MainValidationPipe({ skipMissingProperties: true }))
  @Patch('/:id')
  async updateEvent(@Param('id') id: string, @Body() body: EventResponseDto) {
    return this.faceBookService.updateEvent(id, body);
  }

  @Delete('/:id')
  async deleteEvent(@Param('id') id: string) {
    return this.faceBookService.deleteEvent(id);
  }
}
