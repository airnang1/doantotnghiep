import { BadRequestException, Injectable } from '@nestjs/common';
import { MainRepo } from '../../../repositories/main.repo';
import { RoleResponseDto } from './dto';

@Injectable()
export class RoleService {
  constructor(private readonly _repo: MainRepo) {}

  async createRole(data: RoleResponseDto) {
    return this._repo.getRole().create({ data });
  }

  async updateRole(id: string, input: RoleResponseDto) {
    const role = await this._repo.getRole().findFirst({ where: { id } });

    if (!role) {
      throw new BadRequestException([{ field: 'role', message: 'Role is invalid' }]);
    }

    return await this._repo.getRole().update({ where: { id }, data: input, select: { id: true, updateTime: true } });
  }

  async getRoles() {
    return this._repo
      .getRole()
      .findMany({ select: { id: true, name: true, description: true, insertTime: true, updateTime: true } });
  }

  async getRole(id: string) {
    return await this._repo.getRole().findUnique({
      where: { id },
      select: { id: true, name: true, description: true, insertTime: true, updateTime: true }
    });
  }
}
