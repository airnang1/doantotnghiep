import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../config';
import { AuthInfo } from './mobile.dto';

@Injectable()
export class MobileJwtStrategy extends PassportStrategy(Strategy, 'mobile') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ConfigService.getInstance().get('JWT_SECRET')
    });
  }
  async validate(payload: AuthInfo) {
    const { groupId, id: clientId } = payload;
    return { clientId, groupId };
  }
}
