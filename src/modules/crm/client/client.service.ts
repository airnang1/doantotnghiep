import { Injectable, Logger } from '@nestjs/common';
import { default as axios } from 'axios';
import { ConfigService } from '../../../config';
import { MainRepo } from '../../../repositories/main.repo';
import { hashValue } from '../../../utils';
import { ClientRequestDto } from './client.dto';

const configService = ConfigService.getInstance();

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);

  constructor(private readonly _repo: MainRepo) {}

  async checkUserNameOfClient(username: string) {
    this.logger.log(`checkUserNameOfClient: ${username}`);
    const res = await axios({
      method: 'GET',
      url: `${configService.get('BACKEND_PATH_API')}/api/crm/client/check-exist/${username}`,
      timeout: 10000 //10s
    });
    if (res.data) return true;
    const isExistsUSerName = await this._repo.getClient().count({ where: { username } });
    return Boolean(isExistsUSerName);
  }

  async checkGroupIdOfClient(groupId: string) {
    this.logger.log(`checkGroupIdOfClient: ${groupId}`);
    const res = await axios({
      method: 'GET',
      url: `${configService.get('BACKEND_PATH_API')}/api/crm/client/check-group/${groupId}`,
      timeout: 10000 //10s
    });
    return Boolean(res.data.isExist);
  }

  async callApiCreateClientBackend(client: ClientRequestDto) {
    this.logger.log(`callApiCreateClientBackend: ${client.username}`);

    const res = await axios({
      method: 'POST',
      url: `${configService.get('BACKEND_PATH_API')}/api/crm/client/new`,
      data: client,
      timeout: 10000 //10s
    });
    return res.data.id;
  }

  async createClient(body: ClientRequestDto) {
    const { serverCount, profitRatio, ...client } = body;

    const id = await this.callApiCreateClientBackend(body);

    const newClient = await this._repo.getClient().create({
      data: { ...client, id, password: hashValue(client.password, 10) }
    });

    delete newClient.password;

    return newClient;
  }
}
