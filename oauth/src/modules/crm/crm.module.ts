import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RepositoryModule } from '../../repositories/repo.module';
import { ClientModule } from './client/client.module';
import { CRMAuthGuard } from './crm.guard';
import { CRMJwtStrategy } from './crm.strategy';
import { FeatureModule } from './feature/feature.module';
import { LoginModule } from './login/login.module';
import { PermissionModule } from './permission/permission.module';
import { ProxyModule } from './proxy/proxy.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ClientModule,
    LoginModule,
    RoleModule,
    UserModule,
    FeatureModule,
    PermissionModule,
    ProxyModule,
    RepositoryModule
  ],
  providers: [CRMJwtStrategy, { provide: APP_GUARD, useClass: CRMAuthGuard }]
})
export class CRMModule {}
