import { IsNotEmpty, IsString } from 'class-validator';

export class HandleRefreshTokenDTO {
  @IsString()
  @IsNotEmpty()
  refresh_token: string;

  @IsString()
  @IsNotEmpty()
  user_id: number;
}
