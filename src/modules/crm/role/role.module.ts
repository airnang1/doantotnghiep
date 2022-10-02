import { Module } from '@nestjs/common';
import { RepositoryModule } from '../../../repositories/repo.module';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [RepositoryModule],
  controllers: [RoleController],
  providers: [RoleService]
})
export class RoleModule {}
