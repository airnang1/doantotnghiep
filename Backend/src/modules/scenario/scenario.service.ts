import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Collection, Connection } from 'mongoose';
import { BaseLogger } from '../../core/logger';
import { Channel } from '../../schema/channel.schema';
import { Video } from '../../schema/video.schema';
import { AutomationEvent } from './dto';

const PERCENT_SEARCH_VIDEO = 10; //TODO: 38
const PERCENT_CLICK_VIDEO = 40; // TODO: 52
const PERCENT_CLICK_CHANNEL = 80; // TODO: 5
const PERCENT_LIKE = 5;
const PERCENT_DISLIKE = 1;
const PERCENT_SEEK = 39;
const PERCENT_SUB = 0.1;
const VIDEO_DURATION_MAX = 79;
const VIDEO_DURATION_MIN = 39;
// const HOME_EVENT = { c: 'H' };
const LIKE_EVENT = { c: 'L' };
const DISLIKE_EVENT = { c: 'L' };
const SUB_EVENT = { c: 'SUB' };

@Injectable()
export class ScenarioService extends BaseLogger {
  private readonly channelCollection: Collection;
  private readonly serverCollection: Collection;
  private readonly accountCollection: Collection;
  private readonly proxyCollection: Collection;
  constructor(@InjectConnection() private connection: Connection) {
    super(ScenarioService.name);
    this.channelCollection = this.connection.collection('channels');
    this.serverCollection = this.connection.collection('servers');
    this.accountCollection = this.connection.collection('accounts');
    this.proxyCollection = this.connection.collection('proxy');
  }
  async createScenario(name: string) {
    const server = await this.serverCollection.findOne({ name });
    if (server.scenario && server.scenario.length > 0) {
      return { scenarios: Array(1000).fill(server.scenario) };
    }
    let clientIds = [];
    switch (server.type) {
      case 'premium':
        clientIds = ['techlab', server.clientId];
        break;
      case 'ads':
        clientIds = ['ads', server.clientId];
        break;
      default:
        clientIds = ['cookie', server.clientId];
        break;
    }
    const channelFilter = server.channels ? { id: { $in: server.channels } } : { clientId: { $in: clientIds } };
    const channels = await this.channelCollection.find(channelFilter).toArray();
    const scenarios = [];
    for (let i = 0; i < 222; i++) {
      const channel = randomChannel(channels as Channel[]);
      scenarios.push(searchVideo(channel, server as { subscribe?: number; type?: string; web?: string[] }));
    }

    const channelIds = [];
    channels.forEach((c) => {
      if (!c.other) channelIds.push(c.id, c.title);
    });
    return { scenarios, channels: channelIds };
  }

  async createScenarioNew(name: string, container: string) {
    const [server, account, channels, proxy] = await Promise.all([
      this.serverCollection.findOne({ name }),
      (await this.accountCollection.findOneAndUpdate({ server: name, container: null }, { $set: { container } })).value,
      this.channelCollection.find().toArray(),
      this.proxyCollection.aggregate([{ $match: { using: true } }, { $sample: { size: 1 } }]).toArray()
    ]);
    if (!account) return null;
    if (account.scenario) {
      const scenario = Array.isArray(account.scenario) ? account.scenario[0] : account.scenario;
      return {
        email: account.email,
        password: account.password,
        recoveryEmail: account.recoveryEmail,
        proxy: account.proxy || proxy[0]?.ip,
        browser: account.browser,
        ...scenario
      };
    }
    const accChannels = channels.filter((c) => (account.channels || server.channels)?.includes(c.id));
    const keywords = accChannels.reduce((k, c) => k.concat(...(c.keywords || [])), []);
    keywords.sort(() => 0.5 - Math.random());
    const channelTitles = accChannels.reduce((t, c) => t.concat(c.title), []);
    return {
      email: account.email,
      password: account.password,
      recoveryEmail: account.recoveryEmail,
      proxy: account.proxy || proxy[0]?.ip,
      browser: account.browser,
      c: 'SCH',
      d: server.duration,
      k: keywords.slice(0, 3),
      s: server.subscribe,
      premium: server.type === 'premium',
      cookie: server.type !== 'premium' && server.type !== 'ads',
      web: server.web,
      channels: channelTitles
    };
  }
}

const randomChannel = (channels: Channel[]) => {
  return channels[Math.floor(Math.random() * channels.length)];
};
const getVideosSearch = (videos: Video[]) => {
  const result = { k: [], id: [] };
  for (let i = 0; i < 4; i++) {
    const video = videos[Math.floor(Math.random() * videos.length)];
    // result.k.push(genKeyword(video));
    result.id.push(video.id);
  }
  return result;
};
const getVideoKeyword = (video: Video) => {
  if (!video.tags || video.tags.length < 1) return video.title.split('/')[0];
  if (percent(70)) return video.title.split('/')[0];
  const tags = video.tags.sort((a, b) => b.length - a.length);
  return tags[0];
};
const genKeyword = (video: Video) => {
  if (!video.tags || video.tags.length < 1) return video.title;
  const k = getVideoKeyword(video).replace(/how to /gi, '');
  const arr = k.substring(0, 60).split(' ');
  arr.pop();
  return arr.filter((a) => /^[a-z0-9]+$/i.test(a)).join(' ');
};

const searchVideo = (channel: Channel, server: { subscribe?: number; type?: string; web?: string[] }) => {
  // const result = getVideosSearch(channel.videos);
  return [
    {
      c: 'SCH',
      // ...result,
      k: channel.keywords.slice(0, 3),
      o: channel.other,
      s: server.subscribe,
      premium: server.type === 'premium',
      cookie: server.type !== 'premium' && server.type !== 'ads',
      web: server.web
    }
  ] as AutomationEvent[];
};

const percent = (p: number) => Math.random() < p / 100;
