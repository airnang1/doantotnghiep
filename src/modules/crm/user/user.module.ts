import { Module } from '@nestjs/common';
import { RepositoryModule } from '../../../repositories/repo.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [RepositoryModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
