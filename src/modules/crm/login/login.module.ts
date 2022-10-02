import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '../../../config';
import { RepositoryModule } from '../../../repositories/repo.module';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: ConfigService.getInstance().get('JWT_SECRET_CRM'),
      signOptions: { expiresIn: ConfigService.getInstance().getNumber('JWT_EXPIRATION_CRM') }
    }),
    RepositoryModule
  ],
  controllers: [LoginController],
  providers: [LoginService]
})
export class LoginModule {}
