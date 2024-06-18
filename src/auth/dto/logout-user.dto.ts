import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutUserDTO {
  @IsString()
  @IsNotEmpty()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
