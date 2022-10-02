import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { MainRepo } from '../../../repositories/main.repo';
import { compareHash, hashValue } from '../../../utils';
import { User } from './dto';

@Injectable()
export class LoginService {
  constructor(private readonly _repo: MainRepo) {}

  async validateUser(input: User) {
    const user = await this._repo.getUser().findUnique({
      where: {
        username: input.username
      }
    });

    const role = await this._repo.getRole().findUnique({
      where: {
        id: user.roleId
      }
    });

    const roleName = role.name;
    if (user && compareHash(input.password, user.password)) {
      delete user.password;
      delete user.roleId;

      return { ...user, roleName };
    }
    return null;
  }
}
