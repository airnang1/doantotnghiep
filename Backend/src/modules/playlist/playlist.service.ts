import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { getPagination, sortData } from '../../pagination';
import { Playlist } from '../../schema/playlist.schema';
import { Video } from '../../schema/video.schema';
import { VideoPlaylist } from '../../schema/videoPlaylist.schema';
import { searchKeyword } from '../../search';
import { PlaylistSearchDto } from './dto';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name) private playlistModel: Model<Playlist>,
    @InjectModel(VideoPlaylist.name) private videoPlaylistModel: Model<VideoPlaylist>
  ) {}

  async getPlaylists(query: PlaylistSearchDto) {
    const { page: queryPage, size, sortKey = 'publishedAt', sortOrder = 'desc', keyword } = query;
    const { skip, page, take } = getPagination(queryPage, size);

    const where: FilterQuery<Playlist> = {};

    if (keyword) {
      where.title = searchKeyword(keyword);
    }

    const [totalRecords, data] = await Promise.all([
      this.playlistModel.count(where),
      this.playlistModel
        .find(where, {
          _id: false,
          id: true,
          title: true,
          thumbnail: true,
          description: true,
          publishedAt: true,
          channelId: true,
          itemCount: true
        })
        .skip(skip)
        .limit(take)
        .sort(sortData(sortKey, sortOrder))
    ]);

    return { page, totalRecords, data };
  }

  async getPlaylistById(id: string) {
    const data = await this.playlistModel.findOne({ id });
    if (!data) throw new BadRequestException([{ field: 'playlistId', message: 'Playlist invalid' }]);
    return {
      id: data.id,
      title: data.title,
      thumbnail: data.thumbnail,
      itemCount: data.itemCount,
      viewCount: data.videos.reduce((sum, count: { viewCount: number }) => sum + count?.viewCount, 0),
      videos: data.videos,
      updatedAt: data.updatedAt,
      publishedAt: data.publishedAt
    };
  }

  async getVideosByPlaylist(id: string, query: PlaylistSearchDto) {
    const { page: queryPage, size, sortKey = 'publishedAt', sortOrder = 'desc', keyword } = query;
    const { skip, page, take } = getPagination(queryPage, size);

    const where: FilterQuery<Video> = {};
    if (keyword) {
      where.title = searchKeyword(keyword);
    }
    where.playlistId = id;

    const [totalRecords, data] = await Promise.all([
      this.videoPlaylistModel.count(where),
      this.videoPlaylistModel.find(where).skip(skip).limit(take).sort(sortData(sortKey, sortOrder))
    ]);

    return { page, totalRecords, data };
  }
}
