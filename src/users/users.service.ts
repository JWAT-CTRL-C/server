import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { User } from 'src/entity/user.entity';
import { saltRounds } from 'src/lib/constant';
import { Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ChangePassDTO } from './dto/change-pass.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { DecodeUser } from 'src/lib/type';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDTO: CreateUserDTO, user: DecodeUser) {
    const foundUser = await this.userRepository.findOne({
      where: { usrn: createUserDTO.usrn },
    });

    if (foundUser) throw new ConflictException('Username already exists');

    const hashedPassword = await bcrypt.hash(createUserDTO.pass, saltRounds);

    const newUser = this.userRepository.create({
      ...createUserDTO,
      user_id: randomInt(99),
      pass: hashedPassword,
      crd_user_id: user.user_id,
    });

    await this.userRepository.save(newUser);

    return { success: true, message: 'User created successfully' };
  }

  async changePassword(changePassDTO: ChangePassDTO) {
    const foundUser = await this.userRepository.findOne({
      where: { user_id: changePassDTO.user_id },
    });

    if (!foundUser) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(changePassDTO.oldPass, foundUser.pass);

    if (!isMatch) throw new UnauthorizedException('Old password is incorrect');

    const hashedPassword = await bcrypt.hash(changePassDTO.newPass, saltRounds);

    await this.userRepository.update(
      { user_id: changePassDTO.user_id },
      { pass: hashedPassword },
    );

    return { success: true, message: 'Password changed successfully' };
  }

  async updateProfile(
    user_id: number,
    updateProfileDTO: UpdateProfileDTO,
    user: DecodeUser,
  ) {
    await this.userRepository.update(
      { user_id: user_id },
      { ...updateProfileDTO, upd_user_id: user.user_id },
    );

    return { success: true, message: 'Profile updated successfully' };
  }

  async removeUser(user_id: number, user: DecodeUser) {
    await Promise.all([
      this.userRepository.softDelete({ user_id }),
      this.userRepository.update({ user_id }, { delete_user_id: user.user_id }),
    ]);

    return { success: true, message: 'User deleted successfully' };
  }
}
