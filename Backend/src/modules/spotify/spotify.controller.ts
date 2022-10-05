import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { MainValidationPipe } from '../../pipes';
import { SpotifyResponseDto, SpotifySearchDto } from './dto';
import { SpotifyService } from './spotify.service';

@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Post()
  @UsePipes(new MainValidationPipe())
  async createFaceBook(@Body() body: SpotifyResponseDto) {
    return this.spotifyService.createSpotify(body);
  }

  @Get()
  @UsePipes(new MainValidationPipe())
  async findAll(@Query() query: SpotifySearchDto) {
    return this.spotifyService.getAllSpotify(query);
  }

  @Get('/:id')
  async getFacebookById(@Param('id') id: string) {
    return this.spotifyService.getSpotifyById(id);
  }

  @UsePipes(new MainValidationPipe({ skipMissingProperties: true }))
  @Patch('/:id')
  async updateFacebook(@Param('id') id: string, @Body() body: SpotifyResponseDto) {
    return this.spotifyService.updateSpotify(id, body);
  }

  @Delete('/:id')
  async deleteFacebook(@Param('id') id: string) {
    return this.spotifyService.deleteSpotify(id);
  }
}
