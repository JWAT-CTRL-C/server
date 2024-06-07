import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from 'src/decorator/user.decorator';
import { DecodeUser } from 'src/lib/type';

@ApiBearerAuth()
@ApiHeader({
  name: 'x-user-id',
  required: true,
})
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@User() user: DecodeUser) {
    return user;
  }
}
