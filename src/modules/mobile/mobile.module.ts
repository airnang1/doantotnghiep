import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '../../config';
import { RepositoryModule } from '../../repositories/repo.module';
import { MobileController } from './mobile.controller';
import { MobileAuthGuard } from './mobile.guard';
import { MobileService } from './mobile.service';
import { MobileJwtStrategy } from './mobile.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: ConfigService.getInstance().get('JWT_SECRET'),
      signOptions: { expiresIn: `${ConfigService.getInstance().get('JWT_EXPIRATION')}m` }
    }),
    RepositoryModule
  ],
  controllers: [MobileController],
  providers: [MobileJwtStrategy, { provide: APP_GUARD, useClass: MobileAuthGuard }, MobileService]
})
export class MobileModule {}
