import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Pagination } from '../../dto';
import { MainValidationPipe } from '../../pipes';
import { MailDto } from './dto';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly service: MailService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('import')
  async importMail(@UploadedFile() file: Express.Multer.File) {
    if (file) {
      const ext = file.originalname.split('.').pop();
      if (ext === 'csv') return this.service.importMail(file.buffer);
      throw new BadRequestException([{ field: 'file', message: 'File is not valid' }]);
    }

    throw new BadRequestException([{ field: 'file', message: 'File is not valid' }]);
  }

  @UsePipes(new MainValidationPipe())
  @Patch('change-status')
  changeMailStatus(@Body() body: MailDto) {
    return this.service.updateStatus(body.email, body.status);
  }

  @UsePipes(new MainValidationPipe())
  @Get('list')
  getList(@Query() query: Pagination) {
    return this.service.getMailList(query);
  }
}
