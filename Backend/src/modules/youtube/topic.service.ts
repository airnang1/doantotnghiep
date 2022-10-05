import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { FilterQuery, Model } from 'mongoose';
import { BaseLogger } from '../../core/logger';
import { getPagination, sortData } from '../../pagination';
import { Channel } from '../../schema/channel.schema';
import { Youtube } from '../../schema/youtube.schema';
import { searchKeyword } from '../../search';
import { TopicDto, YoutubeResponseDto } from './dto';

@Injectable()
export class TopicService extends BaseLogger {
  constructor(
    @InjectModel(Youtube.name) private topicModel: Model<Youtube>,
    @InjectModel(Channel.name) private channelModel: Model<Channel>
  ) {
    super(TopicService.name);
  }

  async createTopic(input: YoutubeResponseDto) {
    return await new this.topicModel(input).save({ validateBeforeSave: false, validateModifiedOnly: false });
  }

  async getAllTopic(query: TopicDto) {
    const { page: queryPage, size, sortKey, sortOrder, keyword } = query;
    const { skip, page, take } = getPagination(queryPage, size);

    const where: FilterQuery<Youtube> = {};

    if (keyword) {
      where.name = searchKeyword(keyword);
    }

    const [totalRecords, topic] = await Promise.all([
      this.topicModel.count(where),
      this.topicModel
        .find(where, { _id: true, name: true, createdAt: true })
        .skip(skip)
        .limit(take)
        .sort(sortData(sortKey, sortOrder))
    ]);

    const data = topic.map((p) => ({
      id: p._id,
      name: p.name,
      createAt: p.createdAt
    }));
    return { page, totalRecords, data };
  }

  async getChannelByTopic(id: string, query: TopicDto) {
    const { keyword, page: queryPage, size, sortKey, sortOrder } = query;
    const { skip, page, take } = getPagination(queryPage, size);

    const topic = await this.topicModel.findById(id);
    if (!topic) throw new BadRequestException([{ fields: 'topicId', message: `topicId is invalid` }]);
    const where: FilterQuery<Channel> = { topicId: id };

    if (keyword) {
      where.name = searchKeyword(keyword);
    }

    const [totalRecords, data] = await Promise.all([
      this.channelModel.count(where),
      this.channelModel
        .find(where, { _id: 1, title: 1, thumbnail: 1, subscriberCount: 1, videoCount: 1, viewCount: 1 })
        .skip(skip)
        .limit(take)
        .sort(sortData(sortKey, sortOrder))
    ]);

    return { page, totalRecords, data };
  }

  async deleteTopic(id: ObjectId) {
    const [topic, channel] = await Promise.all([
      this.topicModel.findById(id),
      this.channelModel.find({ topicId: id }, { id: true })
    ]);

    if (!topic || channel.length !== 0) {
      throw new UnprocessableEntityException([{ field: 'topic', message: 'Topic is invalid' }]);
    }

    await this.topicModel.findByIdAndDelete(id);
    return { status: true };
  }
}
