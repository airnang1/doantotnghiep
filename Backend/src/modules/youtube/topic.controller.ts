import { BadRequestException, Controller, Delete, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { Public } from '../../core/decorator';
import { MainValidationPipe, ParseObjectIdPipe } from '../../pipes';
import { TopicDto, YoutubeResponseDto } from './dto';
import { TopicService } from './topic.service';

@Controller('crm/youtube')
export class TopicController {
  constructor(private readonly crmService: TopicService) {}

  @Post('topic')
  @UsePipes(new MainValidationPipe())
  // TODO
  async createTopic(@Query() body: YoutubeResponseDto) {
    return this.crmService.createTopic(body);
  }

  @Get('topic')
  @UsePipes(new MainValidationPipe())
  async findAll(@Query() query: TopicDto) {
    return this.crmService.getAllTopic(query);
  }

  @Public()
  @UsePipes(new MainValidationPipe())
  @Get('topic/:id/channel')
  async getChannelByTopic(@Param('id') id: string, @Query() query: TopicDto) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException([{ fields: 'Param', message: `Params is invalid` }]);
    return this.crmService.getChannelByTopic(id, query);
  }

  @Delete('topic/:id')
  @UsePipes(new MainValidationPipe())
  deleteClient(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.crmService.deleteTopic(id);
  }
}
