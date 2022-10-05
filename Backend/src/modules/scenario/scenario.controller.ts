import { Controller, Get, Param } from '@nestjs/common';
import { ChannelService } from '../channel/channel.service';
import { VideoService } from '../video/video.service';
import { ScenarioService } from './scenario.service';

@Controller('scenario')
export class ScenarioController {
  constructor(
    private readonly scenarioService: ScenarioService,
    private readonly channelService: ChannelService,
    private readonly videoService: VideoService
  ) {}

  @Get(':serverId')
  async createScenario(@Param('serverId') serverId: string) {
    console.log('serverId', serverId);
    return await this.scenarioService.createScenario(serverId);
  }

  @Get(':serverId/:container')
  async createScenarioNew(@Param('serverId') serverId: string, @Param('container') container: string) {
    console.log('serverId', serverId);
    return await this.scenarioService.createScenarioNew(serverId, container);
  }
}
