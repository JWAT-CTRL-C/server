import { Roles } from 'src/decorator/roles.decorator';
import { User } from 'src/decorator/user.decorator';
import { RolesGuard } from 'src/guard/roles.guard';
import { DecodeUser } from 'src/lib/type';

import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiTags } from '@nestjs/swagger';

import { ChangePassDTO } from './dto/change-pass.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { UsersService } from './users.service';

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
  async createUser(@Body() createUserDTO: CreateUserDTO) {
    return this.usersService.createUser(createUserDTO);
  }

  @Get()
  async findAll(@User() user: DecodeUser) {
    return user;
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

  @Patch('update-profile')
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
  async updateProfile(@Body() updateProfileDTO: UpdateProfileDTO) {
    return this.usersService.updateProfile(updateProfileDTO);
  }
}
