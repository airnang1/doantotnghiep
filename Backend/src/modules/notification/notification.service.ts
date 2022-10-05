import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseLogger } from '../../core/logger';
import { Pagination } from '../../dto';
import { getPagination } from '../../pagination';
import { Notification } from '../../schema/notification.schema';

@Injectable()
export class NotificationService extends BaseLogger {
  constructor(@InjectModel(Notification.name) private notificationModel: Model<Notification>) {
    super(NotificationService.name);
  }

  async getNotifications(query: Pagination, clientId: string) {
    const { page: queryPage, size } = query;
    const { skip, page, take } = getPagination(queryPage, size);

    const [totalRecords, data] = await Promise.all([
      this.notificationModel.count({ clientId }),
      this.notificationModel
        .find({ clientId }, { clientId: 0 })
        .skip(skip)
        .limit(take)
        .sort({ isRead: 'asc', createdAt: 'desc' })
    ]);

    return { page, totalRecords, data };
  }

  async readNotification(id: string) {
    return await this.notificationModel.findByIdAndUpdate(id, { isRead: true });
  }

  async deleteNotificationsRead(clientId: string) {
    await this.notificationModel.deleteMany({ clientId, isRead: true });
    return { status: true };
  }

  async countNotificationsUnRead(clientId: string) {
    return await this.notificationModel.count({ clientId, isRead: false });
  }
}
