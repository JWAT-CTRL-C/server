import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutUser {
  @IsString()
  @IsNotEmpty()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
