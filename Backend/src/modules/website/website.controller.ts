import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { MainValidationPipe } from '../../pipes';
import { WebsiteResponseDto, WebsiteSearchDto } from './dto';
import { WebsiteService } from './website.service';

@Controller('website')
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @Post()
  @UsePipes(new MainValidationPipe())
  async createWebsite(@Body() body: WebsiteResponseDto) {
    return this.websiteService.createWebsite(body);
  }

  @Get()
  @UsePipes(new MainValidationPipe())
  async findAll(@Query() query: WebsiteSearchDto) {
    return this.websiteService.getAllWebsite(query);
  }

  @Get('/:id')
  async getWebsiteById(@Param('id') id: string) {
    return this.websiteService.getWebsiteById(id);
  }

  @UsePipes(new MainValidationPipe({ skipMissingProperties: true }))
  @Patch('/:id')
  async updateWebsite(@Param('id') id: string, @Body() body: WebsiteResponseDto) {
    return this.websiteService.updateWebsite(id, body);
  }

  @Delete('/:id')
  async deleteWebsite(@Param('id') id: string) {
    return this.websiteService.deleteWebsite(id);
  }
}
