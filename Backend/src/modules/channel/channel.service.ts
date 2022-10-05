import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { TYPE_CHANNEL } from '../../constants';
import { BaseLogger } from '../../core/logger';
import { getPagination, sortData } from '../../pagination';
import { Channel } from '../../schema/channel.schema';
import { Playlist } from '../../schema/playlist.schema';
import { Video } from '../../schema/video.schema';
import { searchKeyword } from '../../search';
import { getChannel, getPlaylist, getPlaylistChannel, getVideoByChannel, getVideoByIds } from '../../youtube';
import { ChannelRequestDto, ChannelSearchDto } from './dto';

@Injectable()
export class ChannelService extends BaseLogger {
  constructor(
    @InjectModel(Channel.name) private channelModel: Model<Channel>,
    @InjectModel(Playlist.name) private playlistModel: Model<Playlist>,
    @InjectModel(Video.name) private videoModel: Model<Video>
  ) {
    super(ChannelService.name);
  }

  async createChannel(input: ChannelRequestDto) {
    const { channelId, accessToken, secretGoogle, clientGoogle, refreshToken, topicId, duration, other, clientId } =
      input;
    const [channel, playlists, videos] = await Promise.all([
      getChannel(channelId),
      this.getPlaylistByChannel(channelId),
      this.getVideoByChannel(channelId)
    ]);

    const keywords = [];
    videos.forEach((item) => {
      keywords.push(item.snippet?.title?.replace(/[^\x00-\x7F]/g, ''));
      keywords.push(
        item.snippet.tags
          ? item.snippet.tags
              .filter((f) => f.split(' ').length >= 5)
              ?.sort((a, b) => b.length - a.length)[0]
              ?.replace(/[^\x00-\x7F]/g, '')
          : []
      );
    });
    keywords.sort((a, b) => b.length - a.length);

    if (!channel.items || keywords.length === 0)
      throw new UnprocessableEntityException([{ field: 'channel', message: 'Channel is invalid' }]);

    const channelData = channel
      ? {
          id: channel.items[0].id,
          title: channel.items[0].snippet.title,
          thumbnail: channel.items[0].brandingSettings.image?.bannerExternalUrl,
          publishedAt: channel.items[0].snippet.publishedAt,
          description: channel.items[0].snippet.description,
          viewCount: channel.items[0].statistics.viewCount,
          subscriberCount: channel.items[0].statistics.subscriberCount,
          videoCount: channel.items[0].statistics.videoCount,
          type: TYPE_CHANNEL.G,
          googleToken: accessToken,
          clientGoogle: clientGoogle,
          secretGoogle: secretGoogle,
          refreshToken: refreshToken,
          topicId: topicId,
          clientId: clientId,
          duration: duration,
          other: other,
          updatedAt: Date.now(),
          keywords: keywords
        }
      : null;

    const playlistsData = playlists.map((item) => ({
      id: item.id,
      title: item.snippet.title,
      thumbnail:
        item.snippet.thumbnails.maxres?.url ||
        item.snippet.thumbnails.standard?.url ||
        item.snippet.thumbnails.default?.url,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      channelId: channelId,
      itemCount: item.contentDetails.itemCount,
      videos: item.videos
    }));

    const videosData = videos.map((item) => ({
      id: item.id,
      title: item.snippet.title,
      thumbnail:
        item.snippet.thumbnails.maxres?.url ||
        item.snippet.thumbnails.standard?.url ||
        item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
      duration: convertTime(item.contentDetails.duration),
      likeCount: item.statistics.likeCount,
      viewCount: item.statistics.viewCount,
      commentCount: item.statistics.commentCount,
      tags: item.snippet.tags,
      channelId: channelId
    }));

    await Promise.all([
      this.videoModel.deleteMany({ channelId: channelId }),
      this.playlistModel.deleteMany({ channelId: channelId })
    ]);

    await Promise.all([
      this.channelModel.updateOne({ id: channelId }, { $set: channelData }, { new: true, upsert: true }),
      this.playlistModel.insertMany(playlistsData)
    ]);

    if (other === false) await this.videoModel.insertMany(videosData);

    return { status: true };
  }

  async getChannels(query: ChannelSearchDto) {
    const { page: queryPage, size, keyword, sortKey = 'publishedAt', sortOrder = 'desc' } = query;
    const { skip, page, take } = getPagination(queryPage, size);

    const where: FilterQuery<Channel> = {};

    if (keyword) {
      where.title = searchKeyword(keyword);
    }

    const [totalRecords, channel] = await Promise.all([
      this.channelModel.count(where),
      this.channelModel.find(where).skip(skip).limit(take).sort(sortData(sortKey, sortOrder))
    ]);

    const data = channel.map((item) => ({
      id: item.id,
      title: item.title,
      thumbnail: item.thumbnail,
      publishedAt: item.publishedAt,
      description: item.description,
      viewCount: item.viewCount,
      subscriberCount: item.subscriberCount,
      videoCount: item.videoCount,
      type: item.type
    }));

    return { page, totalRecords, data };
  }

  async getChannelById(id: string) {
    const channel = await this.channelModel.findOne(
      { id },
      {
        id: true,
        title: true,
        description: true,
        videoCount: true,
        viewCount: true,
        subscriberCount: true,
        publishedAt: true,
        thumbnail: true,
        updatedAt: true
      }
    );

    if (!channel) throw new BadRequestException([{ field: 'channelId', message: 'Channel Not Found' }]);

    return {
      id: channel.id,
      title: channel.title,
      description: channel.description,
      videoCount: channel.videoCount,
      viewCount: channel.viewCount,
      subscriberCount: channel.subscriberCount,
      publishedAt: channel.publishedAt,
      thumbnail: channel.thumbnail,
      updatedAt: channel.updatedAt
    };
  }

  async deleteChannel(id: string) {
    const channel = await this.channelModel.findOne({ id: id }, { clientId: true });

    if (channel.clientId) {
      throw new BadRequestException([{ field: 'channel', message: 'Channel is invalid' }]);
    }

    await Promise.all([
      this.videoModel.deleteMany({ channelId: id }),
      this.playlistModel.deleteMany({ channelId: id }),
      this.channelModel.findOneAndRemove({ id })
    ]);

    return { status: true };
  }

  async getChannelsForScenario() {
    return this.channelModel.find({}).exec();
  }

  private async getVideoByChannel(id: string, nextPage = '') {
    const videoData = [];

    for (let i = 0; i < 100; i++) {
      const channelVideos = await getVideoByChannel(id, nextPage);
      if (channelVideos == null) break;

      const videos = await getVideoByIds(channelVideos.items.map((i) => i.id.videoId).join(','));

      videoData.push(...(videos?.items || []));
      nextPage = channelVideos.nextPageToken;
    }

    return videoData;
  }

  private async getVideoByPlaylist(id: string, nextPage = '') {
    const videoData = [];

    while (true) {
      const playlists = await getPlaylist(id, nextPage);
      if (playlists == null) break;

      const data = await getVideoByIds(playlists.items.map((i) => i.snippet.resourceId.videoId).join(','));

      const videos = data.items.map((video) => {
        return {
          id: video.id,
          title: video.snippet.title,
          duration: convertTime(video.contentDetails.duration),
          viewCount: video.statistics.viewCount,
          likeCount: video.statistics.likeCount,
          commentCount: video.statistics.commentCount,
          publishedAt: video.snippet.publishedAt,
          tags: video.snippet.tags,
          thumbnail:
            video.snippet.thumbnails.maxres?.url ||
            video.snippet.thumbnails.standard?.url ||
            video.snippet.thumbnails.default?.url
        };
      });

      videoData.push(...videos);
      nextPage = playlists.nextPageToken;

      if (!nextPage) break;
    }

    return videoData;
  }

  private async getPlaylistByChannel(id: string, nextPage = '') {
    const playlistData = [];

    while (true) {
      const playlist = await getPlaylistChannel(id, nextPage);
      if (playlist == null) break;

      const playlistVideos = await Promise.all(
        playlist.items.map(async (p) => {
          const videos = await this.getVideoByPlaylist(p.id);
          return {
            id: p.id,
            snippet: p.snippet,
            contentDetails: p.contentDetails,
            videos: videos
          };
        })
      );

      playlistData.push(...playlistVideos);
      nextPage = playlist.nextPageToken;
      if (!nextPage) break;
    }

    return playlistData;
  }

  public async getPlaylistsByChannel(id: string, query: ChannelSearchDto) {
    const { page: queryPage, size, keyword, sortKey = 'publishedAt', sortOrder = 'desc' } = query;
    const { skip, page, take } = getPagination(queryPage, size);

    const where: FilterQuery<Playlist> = {};

    where.channelId = id;
    if (keyword) {
      where.title = searchKeyword(keyword);
    }

    const [data, totalRecords] = await Promise.all([
      this.playlistModel
        .find(where, { _id: 0, id: 1, itemCount: 1, publishedAt: 1, thumbnail: 1, title: 1 })
        .skip(skip)
        .limit(take)
        .sort(sortData(sortKey, sortOrder)),
      this.playlistModel.count(where)
    ]);

    return {
      page,
      totalRecords,
      data
    };
  }

  public async getVideosByChannel(id: string, query: ChannelSearchDto) {
    const { page: queryPage, size, keyword, sortKey = 'publishedAt', sortOrder = 'desc' } = query;
    const { skip, page, take } = getPagination(queryPage, size);

    const where: FilterQuery<Video> = {};

    where.channelId = id;
    if (keyword) {
      where.title = searchKeyword(keyword);
    }

    const [data, totalRecords] = await Promise.all([
      this.videoModel
        .find(where, {
          _id: 0,
          id: 1,
          thumbnail: 1,
          title: 1,
          viewCount: 1,
          likeCount: 1,
          commentCount: 1,
          publishedAt: 1
        })
        .skip(skip)
        .limit(take)
        .sort(sortData(sortKey, sortOrder)),
      this.videoModel.count(where)
    ]);

    return {
      page,
      totalRecords,
      data
    };
  }

  async deleteVideo(id: string, videoId: string) {
    const channel = await this.channelModel.findOne(
      { id, videos: { $elemMatch: { id: videoId } } },
      { id: true, videos: true }
    );

    if (!channel) {
      throw new UnprocessableEntityException([{ field: 'channel', message: 'Channel is invalid' }]);
    }

    await this.channelModel.updateOne({ id }, { $pull: { videos: { id: videoId } } });

    return { status: true };
  }
}

function convertTime(duration) {
  let a = duration.match(/\d+/g);

  if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
    a = [0, a[0], 0];
  }

  if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
    a = [a[0], 0, a[1]];
  }
  if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
    a = [a[0], 0, 0];
  }

  duration = 0;

  if (a.length == 3) {
    duration = duration + parseInt(a[0]) * 3600;
    duration = duration + parseInt(a[1]) * 60;
    duration = duration + parseInt(a[2]);
  }

  if (a.length == 2) {
    duration = duration + parseInt(a[0]) * 60;
    duration = duration + parseInt(a[1]);
  }

  if (a.length == 1) {
    duration = duration + parseInt(a[0]);
  }
  return duration;
}
