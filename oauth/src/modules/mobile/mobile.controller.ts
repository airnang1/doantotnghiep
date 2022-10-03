import {
  All,
  Body,
  Controller,
  HttpCode,
  Logger,
  Next,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import * as proxy from 'http-proxy';
import { ConfigService } from '../../config';
import { Public } from '../../core/decorator';
import { MainValidationPipe } from '../../pipes';
import { ChangePasswordDto } from './dto';
import { AuthInfo, AuthRequestDto } from './mobile.dto';
import { MobileService } from './mobile.service';

@Controller('mobile')
export class MobileController {
  private readonly proxyServer: proxy;
  private readonly logger = new Logger(MobileController.name);
  private readonly proxyTarget = ConfigService.getInstance().get('BACKEND_PATH_API');

  constructor(private service: MobileService, private jwtService: JwtService) {
    this.proxyServer = proxy.createProxyServer({ target: this.proxyTarget });
  }

  @HttpCode(200)
  @Public()
  @Post('login')
  @UsePipes(new MainValidationPipe())
  async login(@Body() body: AuthRequestDto) {
    const user = await this.service.validateUser(body);
    if (user) {
      const accessToken = this.jwtService.sign(user);
      return { accessToken };
    }
    throw new UnauthorizedException('INVALID_CREDENTIALS').getResponse();
  }

  @Patch('change-password')
  @UsePipes(new MainValidationPipe())
  async changePassword(@Req() req: Request, @Body() password: ChangePasswordDto) {
    const user = req.user as AuthInfo;
    return this.service.changePassword(password, user.clientId);
  }

  @All('*')
  forwardRequest(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    const auth = req.user as AuthInfo;
    req.url += '?' + new URLSearchParams({ ...req.query, ...auth }).toString();
    this.logger.log(`forwardRequest -> ${req.url}, body: ${JSON.stringify(req.body)}`);
    this.proxyServer.web(req, res, { timeout: 10000 }, next);
  }
}
