import { BadRequestException, Injectable } from '@nestjs/common';
import { MainRepo } from '../../../repositories/main.repo';
import { PermissionRequestDto } from './dto';

@Injectable()
export class PermissionService {
  constructor(private readonly _repo: MainRepo) {}

  async createPermission(data: PermissionRequestDto[]) {
    data.forEach(async (p) => await this._repo.getPermission().create({ data: p }));
    return { status: true };
  }

  async getPermissionByRole(id: string) {
    const role = await this._repo.getRole().findFirst({ where: { id }, select: { id: true, name: true } });

    if (!role) throw new BadRequestException([{ field: 'role', message: 'Role not found' }]);

    return this._repo.getPermission().findMany({
      where: { roleId: id },
      select: {
        feature: { select: { id: true, code: true, name: true } },
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true
      }
    });
  }

  async updatePermission(data: PermissionRequestDto[]) {
    data.forEach(async (p) => {
      await this._repo
        .getPermission()
        .upsert({ where: { roleId_featureId: { roleId: p.roleId, featureId: p.featureId } }, create: p, update: p });
    });

    return { status: true };
  }
}
