import { Controller, Get, Param, Query, UsePipes } from '@nestjs/common';
import { MainValidationPipe } from '../../pipes';
import { PlaylistSearchDto } from './dto';
import { PlaylistService } from './playlist.service';

@Controller('crm/playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @UsePipes(new MainValidationPipe())
  @Get()
  getPlaylists(@Query() query: PlaylistSearchDto) {
    return this.playlistService.getPlaylists(query);
  }

  @Get(':id')
  @UsePipes(new MainValidationPipe())
  getPlaylistById(@Param('id') id: string) {
    return this.playlistService.getPlaylistById(id);
  }

  @Get(':id/videos')
  @UsePipes(new MainValidationPipe())
  getVideosByPlaylist(@Param('id') id: string, @Query() query: PlaylistSearchDto) {
    return this.playlistService.getVideosByPlaylist(id, query);
  }
}
