import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class HandleRefreshTokenDTO {
  @IsString()
  @IsNotEmpty()
  refresh_token: string;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
