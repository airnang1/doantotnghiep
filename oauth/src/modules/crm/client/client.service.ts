import { BadRequestException, Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
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

  async checkUserNameOfClient(input: ClientRequestDto) {
    const userExist = await this._repo.getClient().findFirst({
      where: { username: { equals: input.username, mode: 'insensitive' } },
      select: { username: true }
    });

    if (userExist || userExist?.username.toLowerCase() === input.username.toLowerCase())
      throw new BadRequestException([{ field: 'username', message: 'Tên đăng nhập đã tồn tại' }]);

    this.logger.log(`checkUserNameOfClient: ${input.username}`);
    const res = await axios({
      method: 'GET',
      url: `${configService.get('BACKEND_PATH_API')}/api/crm/client/check-exist/${input.username}`,
      timeout: 10000 //10s
    });
    if (res.data) return true;
    const isExistsUSerName = await this._repo
      .getClient()
      .count({ where: { username: { equals: input.username, mode: 'insensitive' } } });
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

  async callApiDeleteClientBackend(id: string) {
    this.logger.log(`callApiDeleteClientBackend: ${id}`);
    try {
      const res = await axios({
        method: 'DELETE',
        url: `${configService.get('BACKEND_PATH_API')}/api/crm/client/${id}`,
        timeout: 10000 //10s
      });
      return res.data.id;
    } catch (error) {
      throw error.response.data;
    }
  }

  async deleteClient(id: string) {
    const client = await this._repo.getClient().findFirst({ where: { id } });
    if (!client) throw new BadRequestException([{ field: 'clientId', message: 'Client not found' }]);

    const idClient = await this.callApiDeleteClientBackend(id);
    await this._repo.getClient().delete({ where: { id: idClient } });

    return { status: true };
  }
}
