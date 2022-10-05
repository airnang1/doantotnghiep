import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { MainValidationPipe } from '../../pipes';
import { AnalyticService } from './analytics.service';
import { AnalyticRequestDto } from './dto';

@Controller('crm/analytic')
export class AnalyticController {
  constructor(private readonly analyticService: AnalyticService) {}

  @Post(':id')
  createAnalytics(@Param('id') id: string, @Body() body: AnalyticRequestDto) {
    return this.analyticService.createAnalytic(id, body);
  }

  @UsePipes(new MainValidationPipe())
  @Get(':id')
  getAnalytics(@Param('id') id: string) {
    return this.analyticService.getAnalytics(id);
  }
}
