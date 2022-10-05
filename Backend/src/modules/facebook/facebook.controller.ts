import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { MainValidationPipe } from '../../pipes';
import { FacebookResponseDto, FacebookSearchDto } from './dto';
import { FaceBookService } from './facebook.service';

@Controller('facebook')
export class FacebookController {
  constructor(private readonly faceBookService: FaceBookService) {}

  @Post()
  @UsePipes(new MainValidationPipe())
  async createFaceBook(@Body() body: FacebookResponseDto) {
    return this.faceBookService.createFacebook(body);
  }

  @Get()
  @UsePipes(new MainValidationPipe())
  async findAll(@Query() query: FacebookSearchDto) {
    return this.faceBookService.getAllFacebook(query);
  }

  @Get('/:id')
  async getFacebookById(@Param('id') id: string) {
    return this.faceBookService.getFacebookById(id);
  }

  @UsePipes(new MainValidationPipe({ skipMissingProperties: true }))
  @Patch('/:id')
  async updateFacebook(@Param('id') id: string, @Body() body: FacebookResponseDto) {
    return this.faceBookService.updateFacebook(id, body);
  }

  @Delete('/:id')
  async deleteFacebook(@Param('id') id: string) {
    return this.faceBookService.deleteFacebook(id);
  }
}
