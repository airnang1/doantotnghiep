import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { networkInterfaces } from 'os';
import { MainRepo } from '../../repositories/main.repo';
import { compareHash, hashValue } from '../../utils';
import { ChangePasswordDto } from './dto';
import { AuthRequestDto } from './mobile.dto';

@Injectable()
export class MobileService {
  private readonly logger = new Logger(MobileService.name);

  constructor(private readonly _repo: MainRepo) {}

  async validateUser({ username, password }: AuthRequestDto) {
    this.logger.log(`validateUser: ${username}`);

    const user = await this._repo
      .getClient()
      .findUnique({ where: { username }, select: { groupId: true, username: true, id: true, password: true } });
    if (user && compareHash(password, user.password)) {
      delete user.password;
      return user;
    }
    return null;
  }

  async changePassword(input: ChangePasswordDto, id: string) {
    const user = await this._repo.getClient().findFirst({ where: { id }, select: { password: true } });
    if (!compareHash(input.oldPassword, user.password)) {
      throw new BadRequestException([{ field: 'password', message: 'Password is invalid' }]);
    }
    return this._repo.getClient().update({
      where: { id },
      data: { password: hashValue(input.password) },
      select: { updateTime: true }
    });
  }
}
