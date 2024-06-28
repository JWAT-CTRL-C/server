import * as bcrypt from 'bcrypt';
import { generateKeyPairSync } from 'crypto';
import { User } from 'src/entity/user.entity';
import { JwtPayload, KeyPair, TokenPair } from 'src/lib/type';
import { Repository } from 'typeorm';

import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { HandleRefreshTokenDTO } from './dto/handle-refresh-token.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { LogoutUserDTO } from './dto/logout-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async createTokenPair(
    payload: Record<string, any>,
    publicKey: string,
    privateKey: string,
  ) {
    // accessToken
    // refreshToken
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        privateKey,
        algorithm: 'RS256',
        expiresIn: '30 minutes',
      }),
      this.jwtService.signAsync(payload, {
        privateKey,
        algorithm: 'RS256',
        expiresIn: '7 days',
      }),
    ]);
    // verify accessToken
    await this.jwtService
      .verifyAsync(access_token, { publicKey })
      .catch((error) => {
        console.error(error);
        throw new UnauthorizedException('Invalid access token', error);
      });

    return { access_token, refresh_token };
  }

  async login(loginUser: LoginUserDTO) {
    const foundUser = await this.userRepository.findOne({
      where: { usrn: loginUser.usrn },
    });

    if (!foundUser) throw new NotFoundException('User not found');

    const isPasswordMatch = await bcrypt.compare(
      loginUser.pass,
      foundUser.pass,
    );

    if (!isPasswordMatch) throw new UnauthorizedException('Invalid password');

    const payload = {
      user_id: foundUser.user_id,
      usrn: foundUser.usrn,
    };

    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    const tokens = await this.createTokenPair(payload, publicKey, privateKey);

    const key = await this.cacheService.get<TokenPair & KeyPair>(
      `user::${foundUser.user_id.toString()}`,
    );

    if (key) {
      await this.cacheService.del(`user::${foundUser.user_id.toString()}`);
    }

    await this.cacheService.set(
      `user::${foundUser.user_id.toString()}`,
      { ...tokens, public_key: publicKey, private_key: privateKey },
      7 * 24 * 60 * 60 * 1000,
    );

    return {
      user_id: foundUser.user_id,
      ...tokens,
    };
  }

  async handleRefreshToken({ refresh_token, user_id }: HandleRefreshTokenDTO) {
    try {
      const key = await this.cacheService.get<TokenPair & KeyPair>(
        `user::${user_id.toString()}`,
      );

      if (!key) throw new NotFoundException('Key not found');

      const decodeUser: JwtPayload = await this.jwtService.verifyAsync(
        refresh_token,
        {
          publicKey: key.private_key,
        },
      );

      if (key.refresh_token !== refresh_token) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const foundUser = await this.userRepository.findOne({
        where: { user_id: decodeUser.user_id },
      });

      if (!foundUser) throw new BadRequestException('User not found');

      const payload = {
        user_id: foundUser.user_id,
        usrn: foundUser.usrn,
      };

      const tokens = await this.createTokenPair(
        payload,
        key.public_key,
        key.private_key,
      );

      const ttl = await this.cacheService.store.ttl(
        `user::${foundUser.user_id.toString()}`,
      );

      await this.cacheService.set(
        `user::${foundUser.user_id.toString()}`,
        { ...key, ...tokens },
        ttl,
      );

      return tokens;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, error.status ?? 401);
    }
  }

  async logout({ refresh_token, user_id }: LogoutUserDTO) {
    try {
      const key = await this.cacheService.get<TokenPair & KeyPair>(
        `user::${user_id.toString()}`,
      );

      if (!key) throw new BadRequestException('User not found');

      const decodeUser: JwtPayload = await this.jwtService.verifyAsync(
        refresh_token,
        {
          publicKey: key.private_key,
        },
      );

      await this.cacheService.del(`user::${decodeUser.user_id.toString()}`);

      return { success: true, message: 'Logout successfully' };
    } catch (error) {
      throw error;
    }
  }
}
