import { Controller, Get, UsePipes } from '@nestjs/common';
import { MainValidationPipe } from '../../pipes';
import { CreditService } from './credit.service';

@Controller('credit')
export class CreditController {
  constructor(private readonly couponService: CreditService) {}

  @Get()
  @UsePipes(new MainValidationPipe())
  async getCredits() {
    return [];
    // return this.creditService.getCredits(query);
  }
}
