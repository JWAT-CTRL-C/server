import { Roles } from 'src/decorator/roles.decorator';
import { User } from 'src/decorator/user.decorator';
import { RolesGuard } from 'src/guard/roles.guard';
import { DecodeUser } from 'src/lib/type';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { ChangePassDTO } from './dto/change-pass.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiHeader({
  name: 'x-user-id',
  required: true,
})
@ApiTags('Users')
@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('HM', 'MA')
  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        usrn: {
          example: 'username',
          type: 'string',
        },
        pass: {
          example: 'password',
          type: 'string',
        },
      },
      required: ['usrn', 'pass'],
    },
  })
  async createUser(
    @Body() createUserDTO: CreateUserDTO,
    @User() user: DecodeUser,
  ) {
    return this.usersService.createUser(createUserDTO, user);
  }

  @Get('all')
  @Roles('HM', 'MA', 'PM')
  async findAll() {
    return this.usersService.getAllUsers();
  }

  @Get('all/admin')
  @Roles('HM', 'MA')
  async findAllAdmin(@Query('page') page: string) {
    return this.usersService.getAllUsersAdmin(+page);
  }

  @Get('me')
  async getMe(@User() user: DecodeUser) {
    return this.usersService.getProfile(user.user_id);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: 'number',
  })
  async findOne(@Param('id') user_id: number) {
    return this.usersService.getProfile(user_id);
  }

  @Post('upload-image')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @User() user: DecodeUser,
  ) {
    return this.usersService.uploadImage(file, user);
  }

  @Post('change-password')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user_id: {
          example: 1,
          type: 'number',
        },
        oldPass: {
          example: 'old_password',
          type: 'string',
        },
        newPass: {
          example: 'new_password',
          type: 'string',
        },
      },
      required: ['user_id', 'oldPass', 'newPass'],
    },
  })
  async changePassword(@Body() changePassDTO: ChangePassDTO) {
    return this.usersService.changePassword(changePassDTO);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: 'number',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user_id: {
          example: 1,
          type: 'number',
        },
        usrn: {
          example: 'username',
          type: 'string',
        },
        role: {
          example: 'HM',
          type: 'string',
        },
      },
      required: ['user_id'],
    },
  })
  async updateProfile(
    @Param('id') user_id: number,
    @Body() updateProfileDTO: UpdateProfileDTO,
    @User() user: DecodeUser,
  ) {
    return this.usersService.updateProfile(user_id, updateProfileDTO, user);
  }

  @Roles('HM', 'MA')
  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: 'number',
  })
  async delete(@Param('id') user_id: number, @User() user: DecodeUser) {
    return this.usersService.removeUser(user_id, user);
  }

  @Roles('HM', 'MA')
  @Patch(':id/restore')
  @ApiParam({
    name: 'id',
    required: true,
    type: 'number',
  })
  async restoreUser(@Param('id') id: number) {
    await this.usersService.restoreUser(id);
  }
  @Post(':noti_id/seen')
  @ApiParam({
    name: 'noti_id',
    required: true,
    type: 'string',
  })
  async seenNotification(
    @Param('noti_id') noti_id: string,
    @User() user: DecodeUser,
  ) {
    return this.usersService.seenNotification(noti_id, user);
  }
}
