import { All, Controller, Logger, Next, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as proxy from 'http-proxy';
import { ConfigService } from '../../../config';
import { Public } from '../../../core/decorator';

@Controller('crm')
export class ProxyController {
  private readonly proxyServer: proxy;
  private readonly logger = new Logger(ProxyController.name);
  private readonly proxyTarget = ConfigService.getInstance().get('BACKEND_PATH_API');

  constructor() {
    this.proxyServer = proxy.createProxyServer({ target: this.proxyTarget });
  }

  @Public()
  @All('*')
  forwardRequest(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    this.logger.log(`forwardRequest -> ${req.url}`);
    this.proxyServer.web(req, res, { timeout: 10000 }, next);
  }
}
