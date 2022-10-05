import { Controller, Delete, Get, Param, Post, UsePipes } from '@nestjs/common';
import { MainValidationPipe } from '../../pipes';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':topicId/:channelId')
  @UsePipes(new MainValidationPipe())
  async createComment(@Param('topicId') topicId: string, @Param('channelId') channelId: string) {
    return this.commentService.createComment(topicId, channelId);
  }

  @Get()
  @UsePipes(new MainValidationPipe())
  async findAll() {
    return this.commentService.getAllComment();
  }

  @Get(':id')
  @UsePipes(new MainValidationPipe())
  async findAllByTopic(@Param('id') topicId: string) {
    return this.commentService.getAllComment(topicId);
  }

  @Delete('/:id')
  async deleteComment(@Param('id') id: string) {
    return this.commentService.deleteComment(id);
  }
}
