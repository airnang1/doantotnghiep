import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel, ChannelSchema } from '../../schema/channel.schema';
import { Client, ClientSchema } from '../../schema/client.schema';
import { Group, GroupSchema } from '../../schema/group.schema';
import { Revenue, RevenueSchema } from '../../schema/revenue.schema';
import { Server, ServerSchema } from '../../schema/server.schema';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Server.name, schema: ServerSchema },
      { name: Channel.name, schema: ChannelSchema },
      { name: Revenue.name, schema: RevenueSchema }
    ])
  ],
  controllers: [GroupController],
  providers: [GroupService]
})
export class GroupModule {}
