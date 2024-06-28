import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { User } from 'src/entity/user.entity';
import { saltRounds } from 'src/lib/constant';
import { Repository } from 'typeorm';

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ChangePassDTO } from './dto/change-pass.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { DecodeUser } from 'src/lib/type';
import { selectUser } from 'src/lib/constant/user';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Notification } from 'src/entity/notification.entity';
import { UserNotificationRead } from 'src/entity/user_notification_read.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(UserNotificationRead)
    private userNotificationReadRepository: Repository<UserNotificationRead>,
    private cloudinaryService: CloudinaryService,
  ) {}

  private readonly LIMIT = 10;

  async createUser(createUserDTO: CreateUserDTO, user: DecodeUser) {
    const foundUser = await this.userRepository.findOne({
      where: { usrn: createUserDTO.usrn },
    });

    if (foundUser) throw new ConflictException('Username already exists');

    const hashedPassword = await bcrypt.hash(createUserDTO.pass, saltRounds);

    const newUser = this.userRepository.create({
      ...createUserDTO,
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

    if (!foundUser) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(changePassDTO.oldPass, foundUser.pass);

    if (!isMatch)
      throw new UnprocessableEntityException('Old password is incorrect');

    const hashedPassword = await bcrypt.hash(changePassDTO.newPass, saltRounds);

    await this.userRepository.update(
      { user_id: changePassDTO.user_id },
      { pass: hashedPassword },
    );

    return { success: true, message: 'Password changed successfully' };
  }

  async getProfile(user_id: number) {
    const user = await this.userRepository.findOne({
      where: { user_id },
      select: selectUser,
      relations: { workspaces: { workspace: true } },
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      ...user,
      workspaces: user.workspaces.map((w) => ({
        wksp_id: w.workspace.wksp_id,
        wksp_name: w.workspace.wksp_name,
      })),
    };
  }

  async uploadImage(file: Express.Multer.File, user: DecodeUser) {
    const image = await this.cloudinaryService
      .uploadImage(file, 'users', user.usrn)
      .catch((e) => {
        console.log(e);
        throw new BadRequestException();
      });

    await this.userRepository.update(
      { user_id: user.user_id },
      { avatar: image.url },
    );

    return {
      success: true,
      data: {
        public_id: image.public_id,
        url: image.url,
      },
    };
  }

  async updateProfile(
    user_id: number,
    updateProfileDTO: UpdateProfileDTO,
    user: DecodeUser,
  ) {
    const foundUser = await this.userRepository.findOne({
      where: { user_id: user.user_id },
    });

    if (!foundUser) throw new NotFoundException('User not found');

    if (
      foundUser.user_id !== user_id &&
      foundUser.role !== 'HM' &&
      foundUser.role !== 'MA'
    )
      throw new ForbiddenException('You are not allowed to update this user');

    await this.userRepository.update(
      { user_id: user_id },
      { ...updateProfileDTO, upd_user_id: user.user_id },
    );

    return { success: true, message: 'Profile updated successfully' };
  }

  async removeUser(user_id: number, user: DecodeUser) {
    const foundUser = await this.userRepository.findOne({
      where: { user_id },
      withDeleted: true,
    });
    if (!foundUser) throw new NotFoundException('User not found');
    if (foundUser.deleted_at)
      throw new BadRequestException('User already deleted');
    await Promise.all([
      this.userRepository.softDelete({ user_id }),
      this.userRepository.update(
        { user_id },
        { deleted_user_id: user.user_id },
      ),
    ]);

    return { success: true, message: 'User deleted successfully' };
  }

  async getAllUsers() {
    const users = await this.userRepository.find({
      select: selectUser,
    });

    return users;
  }

  async getAllUsersAdmin(page: number) {
    const skip = (page - 1) * this.LIMIT;

    const [users, count] = await this.userRepository.findAndCount({
      skip,
      take: this.LIMIT,
      select: selectUser,
      withDeleted: true,
      order: {
        user_id: 'ASC',
      },
    });

    return {
      data: users,
      currentPage: page,
      totalPages: Math.ceil(count / this.LIMIT),
    };
  }

  async restoreUser(user_id: number) {
    const foundUser = await this.userRepository.findOne({
      where: { user_id },
      withDeleted: true,
    });
    if (!foundUser) throw new NotFoundException('User not found');
    if (!foundUser.deleted_at)
      throw new BadRequestException('User already restored');

    await this.userRepository.restore({ user_id });

    return { success: true, message: 'User Restore successfully' };
  }
  async seenNotification(noti_id: string, user: DecodeUser) {
    const foundUser = await this.userRepository.findOneBy({
      user_id: user.user_id,
    });

    if (!foundUser) throw new NotFoundException('User not found');
    const noti = await this.notificationRepository.findOneBy({
      noti_id,
    });

    if (!noti) throw new NotFoundException('Notification not found');
    return await this.userNotificationReadRepository
      .findOne({
        where: {
          noti_id,
          user_id: foundUser.user_id,
          is_read: true,
        },
      })
      .then(async (res) => {
        if (!res) {
          const seenNotify = this.userNotificationReadRepository.create({
            noti_id,
            user_id: foundUser.user_id,
          });
          return await this.userNotificationReadRepository
            .save(seenNotify)
            .then(() => {
              return { success: true, message: 'success' };
            })
            .catch(() => {
              throw new InternalServerErrorException('Something went wrong');
            });
        }
      });
  }
}
