import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BaseLogger } from '../../core/logger';
import { Spotify } from '../../schema/spotify.schema';
import { SpotifyResponseDto, SpotifySearchDto } from './dto';

@Injectable()
export class SpotifyService extends BaseLogger {
  constructor(@InjectModel(Spotify.name) private spotifyModel: Model<Spotify>) {
    super(SpotifyService.name);
  }

  async createSpotify(input: SpotifyResponseDto) {
    return await new this.spotifyModel(input).save({ validateBeforeSave: false, validateModifiedOnly: false });
  }

  async getAllSpotify(query: SpotifySearchDto) {
    const { keyword, page = 1, size = 10 } = query;
    const where: FilterQuery<Spotify> = {};

    if (keyword) {
      where.name = { $regex: keyword };
    }
    const [totalRecords, data] = await Promise.all([
      this.spotifyModel.count(where),
      this.spotifyModel
        .find(where)
        .skip(size * (page - 1))
        .limit(size)
    ]);

    return { page, totalRecords, data };
  }

  async getSpotifyById(id: string) {
    return await this.spotifyModel.findById(id);
  }

  async updateSpotify(id: string, input: SpotifyResponseDto) {
    return await this.spotifyModel.findByIdAndUpdate(id, input, { new: true });
  }

  async deleteSpotify(id: string) {
    await this.spotifyModel.deleteOne({ _id: id });
    return { status: true };
  }
}
