import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { LoginUser, RegisterUser } from 'src/lib/type';
import { Public } from 'src/decorator/public.decorator';

@Public()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
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
  @HttpCode(HttpStatus.PERMANENT_REDIRECT)
  async register(@Body() registerUser: RegisterUser) {
    return this.authService.register(registerUser);
  }

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
  async login(@Body() loginUser: LoginUser) {
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
      },
      required: ['refresh_token'],
    },
  })
  async refreshToken(@Body() body: { user_id: number; refresh_token: string }) {
    return this.authService.refreshToken(body.user_id, body.refresh_token);
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
      },
      required: ['refresh_token'],
    },
  })
  async logout(@Body() body: { user_id: number; refresh_token: string }) {
    return this.authService.logout(body.user_id, body.refresh_token);
  }
}
