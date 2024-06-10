import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { Public } from 'src/decorator/public.decorator';
import { LoginUserDTO } from './dto/login-user.dto';
import { LogoutUserDTO } from './dto/logout-user.dto';
import { HandleRefreshTokenDTO } from './dto/handle-refresh-token.dto';

@Public()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
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
  async login(@Body() loginUser: LoginUserDTO) {
    return this.authService.login(loginUser);
  }

  @Post('refresh')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refresh_token: {
          example: 'refresh_token',
          type: 'string',
        },
        user_id: {
          example: 1,
          type: 'number',
        },
      },
      required: ['refresh_token'],
    },
  })
  async handleRefreshToken(@Body() data: HandleRefreshTokenDTO) {
    return this.authService.handleRefreshToken(data);
  }

  @Post('logout')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refresh_token: {
          example: 'refresh_token',
          type: 'string',
        },
        user_id: {
          example: 1,
          type: 'number',
        },
      },
      required: ['refresh_token'],
    },
  })
  async logout(@Body() logoutUser: LogoutUserDTO) {
    return this.authService.logout(logoutUser);
  }
}
