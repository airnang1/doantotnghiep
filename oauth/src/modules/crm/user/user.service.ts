import { BadRequestException, Injectable } from '@nestjs/common';
import { MainRepo } from '../../../repositories/main.repo';
import { UserRequestDto, UserSearchDto } from './dto';
import { hashValue } from '../../../utils';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly _repo: MainRepo) {}

  async createUser(input: UserRequestDto) {
    await this.checkExist(input);

    const role = await this._repo.getRole().findFirst({
      where: { id: input.roleId },
      select: { id: true, name: true }
    });

    if (!role) {
      throw new BadRequestException([{ field: 'role', message: 'Role is invalid' }]);
    }

    input.password = hashValue(input.password);
    return this._repo.getUser().create({
      data: input,
      select: { id: true, username: true, password: true, roleId: true, status: true }
    });
  }

  async getAllUser(query: UserSearchDto) {
    const { keyword, page: queryPage, size, sortKey = 'insertTime', sortOrder = 'desc' } = query;

    const { skip, take, page } = this._repo.getPagination(queryPage, size);

    const where: Prisma.UserWhereInput = {};

    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { username: { contains: keyword, mode: 'insensitive' } }
      ];
    }

    const [totalRecords, data] = await Promise.all([
      this._repo.getUser().count({ where }),
      this._repo.getUser().findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          name: true,
          username: true,
          role: { select: { id: true, name: true } },
          status: true,
          insertTime: true
        },
        orderBy: { [sortKey]: sortOrder }
      })
    ]);

    return { page, totalRecords, data };
  }

  async checkExist(input: UserRequestDto) {
    const userExist = await this._repo.getUser().findFirst({
      where: { username: input.username },
      select: { username: true }
    });
    if (!userExist) return;
    if (input.username && userExist.username.toLowerCase() === input.username.toLowerCase())
      throw new BadRequestException([{ field: 'userName', message: 'UserName is invalid' }]);
  }
}
