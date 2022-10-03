import { Body, Controller, Delete, Get, Param, Post, UsePipes } from '@nestjs/common';
import { MainValidationPipe } from '../../../pipes';
import { FeatureRequestDto } from './dto';
import { FeatureService } from './feature.service';

@Controller('crm/feature')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Post()
  @UsePipes(new MainValidationPipe())
  createFeature(@Body() body: FeatureRequestDto) {
    return this.featureService.createFeature(body);
  }

  @Get()
  getFeatures() {
    return this.featureService.getFeatures();
  }

  @Delete(':id')
  deleteFeature(@Param('id') id: string) {
    return this.featureService.deleteFeature(id);
  }
}
