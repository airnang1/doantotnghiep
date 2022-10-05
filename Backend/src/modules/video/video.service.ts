import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { getPagination, sortData } from '../../pagination';
import { Video } from '../../schema/video.schema';
import { searchKeyword } from '../../search';
import { VideoSearchDto } from './dto';

@Injectable()
export class VideoService {
  constructor(@InjectModel(Video.name) private videoModel: Model<Video>) {}

  async getVideos(query: VideoSearchDto) {
    const { page: queryPage, size, sortKey = 'publishedAt', sortOrder, keyword } = query;
    const { skip, page, take } = getPagination(queryPage, size);

    const where: FilterQuery<Video> = {};

    if (keyword) {
      where.title = searchKeyword(keyword);
    }

    const [totalRecords, data] = await Promise.all([
      this.videoModel.count(where),
      this.videoModel.find(where, { _id: false, __v: false }).skip(skip).limit(take).sort(sortData(sortKey, sortOrder))
    ]);

    return { page, totalRecords, data };
  }
  async getVideosForScenario() {
    return this.videoModel.find().exec();
  }
}
