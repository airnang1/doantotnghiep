import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { MainValidationPipe } from '../../pipes';
import { AccountService } from './account.service';
import { AccountsQueryDto } from './dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @UsePipes(new MainValidationPipe())
  async getAccounts(@Query() query: AccountsQueryDto) {
    return this.accountService.getAccounts(query);
  }

  // @Patch(':email/flags')
  // @UsePipes(new MainValidationPipe())
  // async updateAccountFlags(@Param('email') email: string, @Body() body: UpdateAccountFlagsDto) {
  //   return this.accountService.updateAccountFlags(email, body);
  // }
}
