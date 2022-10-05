import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from '../../schema/client.schema';
import { Group, GroupSchema } from '../../schema/group.schema';
import { Revenue, RevenueSchema } from '../../schema/revenue.schema';
import { Server, ServerSchema } from '../../schema/server.schema';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Client.name, schema: ClientSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Server.name, schema: ServerSchema },
      { name: Revenue.name, schema: RevenueSchema }
    ])
  ],
  controllers: [ClientController],
  providers: [ClientService]
})
export class ClientModule {}
