import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { MainValidationPipe } from '../../../pipes';
import { UserRequestDto, UserSearchDto } from './dto';
import { UserService } from './user.service';

@Controller('crm/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new MainValidationPipe())
  @Post()
  async createUser(@Body() body: UserRequestDto) {
    return this.userService.createUser(body);
  }

  @Get()
  @UsePipes(new MainValidationPipe())
  async findAll(@Query() query: UserSearchDto) {
    return this.userService.getAllUser(query);
  }
}
