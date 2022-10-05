import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BaseLogger } from '../../core/logger';
import { Facebook } from '../../schema/facebook.schema';
import { FacebookResponseDto, FacebookSearchDto } from './dto';

@Injectable()
export class FaceBookService extends BaseLogger {
  constructor(@InjectModel(Facebook.name) private facebookModel: Model<Facebook>) {
    super(FaceBookService.name);
  }

  async createFacebook(input: FacebookResponseDto) {
    return await new this.facebookModel(input).save({ validateBeforeSave: false, validateModifiedOnly: false });
  }

  async getAllFacebook(query: FacebookSearchDto) {
    const { keyword, page = 1, size = 10 } = query;
    const where: FilterQuery<Facebook> = {};

    if (keyword) {
      where.name = { $regex: keyword };
    }
    const [totalRecords, data] = await Promise.all([
      this.facebookModel.count(where),
      this.facebookModel
        .find(where)
        .skip(size * (page - 1))
        .limit(size)
    ]);

    return { page, totalRecords, data };
  }

  async getFacebookById(id: string) {
    return await this.facebookModel.findById(id);
  }

  async updateFacebook(id: string, input: FacebookResponseDto) {
    return await this.facebookModel.findByIdAndUpdate(id, input, { new: true });
  }

  async deleteFacebook(id: string) {
    await this.facebookModel.deleteOne({ _id: id });
    return { status: true };
  }
}
