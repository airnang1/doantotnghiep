import { Controller, Delete, Get, Param, Patch, Query, Req, UsePipes } from '@nestjs/common';
import { AuthRequest, Pagination } from '../../dto';
import { MainValidationPipe } from '../../pipes';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  @UsePipes(new MainValidationPipe())
  async getNotifications(@Query() query: Pagination, @Req() req: AuthRequest) {
    const client = req.user;
    return this.notificationService.getNotifications(query, client.id);
  }

  @Patch(':id')
  async readNotification(@Param('id') id: string) {
    return this.notificationService.readNotification(id);
  }

  @Delete('delete')
  async deleteNotificationsRead(@Req() req: AuthRequest) {
    const client = req.user;
    return this.notificationService.deleteNotificationsRead(client.id);
  }

  @Get('unread')
  async countNotificationsUnRead(@Req() req: AuthRequest) {
    const client = req.user;
    return this.notificationService.countNotificationsUnRead(client.id);
  }
}
