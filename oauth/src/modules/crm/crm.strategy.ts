import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../config';

@Injectable()
export class CRMJwtStrategy extends PassportStrategy(Strategy, 'crm') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ConfigService.getInstance().get('JWT_SECRET_CRM')
    });
  }
  async validate(payload: { sub: string; username: string }) {
    console.log(`payload`, payload);
    return { userId: payload.sub, username: payload.username };
  }
}
