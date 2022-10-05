import { Controller, Delete, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import { MainValidationPipe } from '../../pipes';
import { ChannelService } from './channel.service';
import { ChannelRequestDto, ChannelSearchDto } from './dto';

@Controller('crm/channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @UsePipes(new MainValidationPipe())
  @Get()
  getChannels(@Query() query: ChannelSearchDto) {
    return this.channelService.getChannels(query);
  }

  @Post()
  // TODO
  createChannel(@Query() input: ChannelRequestDto) {
    return this.channelService.createChannel({ ...input, other: String(input.other).toLocaleLowerCase() === 'true' });
  }

  @UsePipes(new MainValidationPipe())
  @Get(':id')
  getChannelById(@Param('id') id: string) {
    return this.channelService.getChannelById(id);
  }

  @Delete(':id')
  deleteChannel(@Param('id') id: string) {
    return this.channelService.deleteChannel(id);
  }

  @UsePipes(new MainValidationPipe())
  @Get(':id/playlists')
  async getPlaylistsByChannel(@Param('id') id: string, @Query() query: ChannelSearchDto) {
    return this.channelService.getPlaylistsByChannel(id, query);
  }

  @UsePipes(new MainValidationPipe())
  @Get(':id/videos')
  async getVideosByChannel(@Param('id') id: string, @Query() query: ChannelSearchDto) {
    return this.channelService.getVideosByChannel(id, query);
  }

  @Delete(':id/video-channel/:videoId')
  deleteVideo(@Param('id') id: string, @Param('videoId') videoId: string) {
    return this.channelService.deleteVideo(id, videoId);
  }
}
