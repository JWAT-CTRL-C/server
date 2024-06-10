import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { generateKeyPairSync } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entity/user.entity';
import { Key } from 'src/entity/key.entity';
import { JwtPayload } from 'src/lib/type';
import { LoginUserDTO } from './dto/login-user.dto';
import { LogoutUserDTO } from './dto/logout-user.dto';
import { HandleRefreshTokenDTO } from './dto/handle-refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Key) private keyRepository: Repository<Key>,
  ) {}

  async createTokenPair(
    payload: Record<string, any>,
    publicKey: string,
    privateKey: string,
  ) {
    // accessToken
    // refreshToken
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        privateKey,
        algorithm: 'RS256',
        expiresIn: '10 minutes',
      }),
      this.jwtService.signAsync(payload, {
        privateKey,
        algorithm: 'RS256',
        expiresIn: '7 days',
      }),
    ]);
    // verify accessToken
    await this.jwtService
      .verifyAsync(accessToken, { publicKey })
      .catch((error) => {
        console.error(error);
        throw new UnauthorizedException('Invalid access token', error);
      });

    return { accessToken, refreshToken };
  }

  async login(loginUser: LoginUserDTO) {
    const foundUser = await this.userRepository.findOne({
      where: { usrn: loginUser.usrn },
    });

    if (!foundUser) throw new UnauthorizedException('User not found');

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

    const newKey = this.keyRepository.create({
      user: foundUser,
      public_key: publicKey,
      private_key: privateKey,
    });

    await this.keyRepository.upsert(newKey, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ['user'],
    });

    return {
      ...tokens,
    };
  }

  async handleRefreshToken({ refresh_token, user_id }: HandleRefreshTokenDTO) {
    try {
      const key = await this.keyRepository.findOne({
        where: { user: { user_id } },
      });

      if (!key) throw new BadRequestException('User not found');

      if (key.refresh_token_used.includes(refresh_token)) {
        throw new ForbiddenException(
          'Something went wrong! Please login again',
        );
      }

      const decodeUser: JwtPayload = await this.jwtService.verifyAsync(
        refresh_token,
        {
          publicKey: key.private_key,
        },
      );

      const foundUser = await this.userRepository.findOne({
        where: { user_id: decodeUser.user_id },
      });

      const payload = {
        user_id: foundUser.user_id,
        usrn: foundUser.usrn,
      };

      const tokens = await this.createTokenPair(
        payload,
        key.public_key,
        key.private_key,
      );

      await this.keyRepository.update(
        {
          user: { user_id: decodeUser.user_id },
        },
        {
          refresh_token_used: [...key.refresh_token_used, refresh_token],
        },
      );

      return tokens;
    } catch (error) {
      throw error;
    }
  }

  async logout({ refresh_token, user_id }: LogoutUserDTO) {
    try {
      const key = await this.keyRepository.findOne({
        where: { user: { user_id } },
      });

      if (!key) throw new BadRequestException('User not found');

      const decodeUser: JwtPayload = await this.jwtService.verifyAsync(
        refresh_token,
        {
          publicKey: key.private_key,
        },
      );

      await this.keyRepository.update(
        {
          user: { user_id: decodeUser.user_id },
        },
        {
          refresh_token_used: [...key.refresh_token_used, refresh_token],
        },
      );

      return { success: true, message: 'Logout successfully' };
    } catch (error) {
      throw error;
    }
  }
}
