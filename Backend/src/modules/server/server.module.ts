import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from '../../schema/client.schema';
import { Server, ServerSchema } from '../../schema/server.schema';
import { ServerController } from './server.controller';
import { ServerService } from './server.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Server.name, schema: ServerSchema },
      { name: Client.name, schema: ClientSchema }
    ])
  ],
  controllers: [ServerController],
  providers: [ServerService]
})
export class ServerModule {}
