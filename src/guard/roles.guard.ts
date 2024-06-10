import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/entity/user.entity';
import { HEADER, ROLES_KEY } from 'src/lib/constant';
import { DataSource } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private dataSource: DataSource,
  ) {}
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndMerge<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles.length) return true;

    const request = context.switchToHttp().getRequest();
    const user_id = this.extractUserIDFromHeader(request);

    if (!user_id) return false;

    const user = await this.dataSource
      .getRepository(User)
      .findOneBy({ user_id });

    if (!user) return false;

    return roles.includes(user.role);
  }

  private extractUserIDFromHeader(request: Request) {
    return parseInt(request.headers[HEADER.USER_ID] as string | undefined);
  }
}
