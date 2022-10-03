import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class MobileAuthGuard extends AuthGuard('mobile') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Request is using Public decorator
    const request: Request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic || request.url.includes('api/crm')) {
      return true;
    }

    const valid = await super.canActivate(context);
    if (valid) {
      return true;
    }
    return false;
  }
}
