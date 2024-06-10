import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { DataSource } from 'typeorm';

import { Key } from 'src/entity/key.entity';
import { HEADER, IS_PUBLIC_KEY } from 'src/lib/constant';
import { JwtPayload } from 'src/lib/type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest() as Request;
    const user_id = this.extractUserIDFromHeader(request);
    if (!user_id) throw new UnauthorizedException('User id is required');
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('Token is required');

    try {
      const key = await this.dataSource.getRepository(Key).findOne({
        where: { user: { user_id } },
      });

      if (!key) throw new UnauthorizedException('Key is not found');

      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        publicKey: key.public_key,
      });

      if (payload.user_id !== user_id)
        throw new ForbiddenException('Token is invalid');

      request['user'] = payload;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, error.status ?? 419);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractUserIDFromHeader(request: Request) {
    return parseInt(request.headers[HEADER.USER_ID] as string | undefined);
  }
}
