import { IsNotEmpty, IsString } from 'class-validator';

export class HandleRefreshToken {
  @IsString()
  @IsNotEmpty()
  refresh_token: string;

  @IsString()
  @IsNotEmpty()
  user_id: number;
}
