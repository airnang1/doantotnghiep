import { BadRequestException, Body, Controller, Post, UsePipes } from '@nestjs/common';
import { Public } from '../../../core/decorator';
import { MainValidationPipe } from '../../../pipes';
import { ClientRequestDto } from './client.dto';
import { ClientService } from './client.service';

@Controller('crm/client')
export class ClientController {
  constructor(private readonly service: ClientService) {}

  @Public()
  @Post()
  @UsePipes(new MainValidationPipe())
  async createClient(@Body() body: ClientRequestDto) {
    // Check username exist
    const existsUsername = await this.service.checkUserNameOfClient(body.username);
    if (existsUsername) throw new BadRequestException([{ field: 'username', message: 'Username is exists' }]);

    return this.service.createClient(body);
  }
}
