import { Module } from '@nestjs/common';
import { RepositoryModule } from '../../../repositories/repo.module';
import { FeatureController } from './feature.controller';
import { FeatureService } from './feature.service';

@Module({
  imports: [RepositoryModule],
  controllers: [FeatureController],
  providers: [FeatureService]
})
export class FeatureModule {}
