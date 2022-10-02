import { Module } from '@nestjs/common';
import { CRMModule } from './modules/crm/crm.module';
import { MobileModule } from './modules/mobile/mobile.module';

@Module({
  imports: [MobileModule, CRMModule],
  controllers: [],
  providers: []
})
export class AppModule {}
