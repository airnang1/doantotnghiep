import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BaseLogger } from '../../core/logger';
import { Event } from '../../schema/event.schema';
import { EventResponseDto, EventSearchDto } from './dto';

@Injectable()
export class EventService extends BaseLogger {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {
    super(EventService.name);
  }

  async createEvent(input: EventResponseDto) {
    return await new this.eventModel(input).save({ validateBeforeSave: false, validateModifiedOnly: false });
  }

  async getAllEvent(query: EventSearchDto) {
    const { keyword, page = 1, size = 10 } = query;
    const where: FilterQuery<Event> = {};

    if (keyword) {
      where.name = { $regex: keyword };
    }
    const [totalRecords, data] = await Promise.all([
      this.eventModel.count(where),
      this.eventModel
        .find(where)
        .skip(size * (page - 1))
        .limit(size)
    ]);

    return { page, totalRecords, data };
  }

  async getEventById(id: string) {
    return await this.eventModel.findById(id);
  }

  async updateEvent(id: string, input: EventResponseDto) {
    return await this.eventModel.findByIdAndUpdate(id, input, { new: true });
  }

  async deleteEvent(id: string) {
    await this.eventModel.deleteOne({ _id: id });
    return { status: true };
  }
}
