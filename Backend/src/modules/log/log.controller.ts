import { Body, Controller, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import { Pagination } from '../../dto';
import { MainValidationPipe } from '../../pipes';
import { LogSearchDto } from './dto';
import { LogService } from './log.service';

@Controller('log')
export class LogController {
  constructor(private readonly service: LogService) {}

  @Post('new')
  insertLog(@Body() body: Record<string, unknown>) {
    return this.service.insertLog(body);
  }

  @Post('new2')
  insertLog2(@Body() body: Record<string, unknown>) {
    return this.service.insertLog2(body);
  }

  @Post('new3')
  insertLog3(@Body() body: Record<string, unknown>) {
    return this.service.insertLog3(body);
  }

  @UsePipes(new MainValidationPipe())
  @Get('list')
  getList(@Query() query: LogSearchDto) {
    return this.service.getLogList(query);
  }

  @Get('detail/:id')
  getDetail(@Param('id') id: string) {
    return this.service.getDetail(id);
  }

  @UsePipes(new MainValidationPipe())
  @Get('list/:client')
  summaryLog(
    @Param('client') client: string,
    @Query() query: { from: string; to: string; last: number; summary: boolean }
  ) {
    return this.service.summaryLog(client, query);
  }

  @UsePipes(new MainValidationPipe())
  @Get('list/:client/ads')
  summaryAds(
    @Param('client') client: string,
    @Query() query: { from: string; to: string; last: number; summary: boolean }
  ) {
    return this.service.summaryAds(client, query);
  }

  @Post('pc/new')
  insertPCLog(@Body() body: Record<string, unknown>) {
    return this.service.insertPCLog(body);
  }

  @UsePipes(new MainValidationPipe())
  @Get('pc/list')
  getPCLogs(@Query() query: Pagination) {
    return this.service.getPCLogs(query);
  }

  @Get('pc/detail/:id')
  getPcDetail(@Param('id') id: string) {
    return this.service.getPcDetail(id);
  }

  @Post('random/:server')
  randomProxy() {
    return this.service.randomProxy();
  }

  @Post('reset-proxy')
  resetProxy() {
    return this.service.resetProxy();
  }

  @Get('recover')
  recoverAccount() {
    return this.service.recoverAccount();
  }

  @Post('init/:username')
  initializeServers(
    @Param('username') username: string,
    @Body() body: { server: number; account: number; origin: string; type: string }
  ) {
    return this.service.initializeServers(username, body);
  }

  @Post('refill/:server/:count/:origin')
  refillServer(@Param('server') server: string, @Param('count') count: number, @Param('origin') origin: string) {
    return this.service.refillServer(server, count, origin);
  }

  @Get('summary-proxy')
  summaryProxy() {
    return this.service.summaryProxy();
  }
}
