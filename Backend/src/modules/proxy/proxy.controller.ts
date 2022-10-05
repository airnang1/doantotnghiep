import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { Pagination } from '../../dto';
import { MainValidationPipe } from '../../pipes';
import { ProxyInsertDto, ProxyQueryDto, ProxyStatusDto } from './dto';
import { ProxyService } from './proxy.service';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly service: ProxyService) {}

  @UsePipes(new MainValidationPipe())
  @Post('new')
  insertProxy(@Body() body: ProxyInsertDto) {
    return this.service.insertProxy(body);
  }

  @UsePipes(new MainValidationPipe())
  @Post('change-status')
  statusProxy(@Body() body: ProxyStatusDto) {
    return this.service.updateStatus(body);
  }

  @UsePipes(new MainValidationPipe())
  @Get('list')
  getList(@Query() query: Pagination) {
    return this.service.getProxyList(query);
  }

  @UsePipes(new MainValidationPipe())
  @Get()
  getProxies(@Query() query: ProxyQueryDto) {
    return this.service.getProxies(query);
  }
}
