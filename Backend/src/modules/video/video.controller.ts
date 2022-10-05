import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { MainValidationPipe } from '../../pipes';
import { VideoSearchDto } from './dto';
import { VideoService } from './video.service';

@Controller('crm/video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @UsePipes(new MainValidationPipe())
  @Get()
  getVideos(@Query() query: VideoSearchDto) {
    return this.videoService.getVideos(query);
  }
}
