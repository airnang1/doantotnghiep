import { BadRequestException, Injectable } from '@nestjs/common';
import { MainRepo, Operation } from '../../../repositories/main.repo';
import { FeatureRequestDto } from './dto';

@Injectable()
export class FeatureService {
  constructor(private readonly _repo: MainRepo) {}

  async createFeature(data: FeatureRequestDto) {
    await this.checkExist(data);
    return this._repo.getFeature().create({ data, select: { id: true, name: true, code: true } });
  }

  async deleteFeature(id: string) {
    const feature = await this._repo.getFeature().findFirst({ where: { id }, select: { id: true, name: true } });
    const bulkOps: Operation[] = [];

    if (!feature) {
      throw new BadRequestException([{ field: 'feature', message: 'Feature not found' }]);
    }

    bulkOps.push(
      this._repo.getPermission().deleteMany({ where: { featureId: id } }),
      this._repo.getFeature().delete({ where: { id } })
    );

    return this._repo.transaction(bulkOps);
  }

  async getFeatures() {
    return this._repo.getFeature().findMany({ select: { id: true, name: true } });
  }

  async checkExist(input: FeatureRequestDto) {
    const featureExist = await this._repo.getFeature().findFirst({
      where: { code: input.code },
      select: { code: true }
    });
    if (!featureExist) return;
    if (input.code && featureExist.code.toLowerCase() === input.code.toLowerCase())
      throw new BadRequestException([{ field: 'feature', message: 'Feature is invalid' }]);
  }
}
