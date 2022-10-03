import { Module } from '@nestjs/common';
import { RepositoryModule } from '../../../repositories/repo.module';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
  imports: [RepositoryModule],
  controllers: [PermissionController],
  providers: [PermissionService]
})
export class PermissionModule {}
