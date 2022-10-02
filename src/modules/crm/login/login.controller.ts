import { Body, Controller, HttpCode, Post, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../../../config';
import { Public } from '../../../core/decorator';
import { User } from './dto';
import { LoginService } from './login.service';

@Controller('crm/login')
export class LoginController {
  constructor(private loginService: LoginService, private jwtService: JwtService) {}

  @HttpCode(200)
  @Public()
  @Post()
  @UsePipes(new ValidationPipe())
  async loginCRM(@Body() body: User) {
    const user = await this.loginService.validateUser(body);

    if (user) {
      const payload = { id: user.id, name: user.username, role: user.roleName };
      const expiresIn = ConfigService.getInstance().getNumber('JWT_EXPIRATION_CRM');
      const accessToken = this.jwtService.sign(payload, { expiresIn });
      return { accessToken, expiresIn };
    }
    throw new UnauthorizedException('INVALID_CREDENTIALS').getResponse();
  }
}
