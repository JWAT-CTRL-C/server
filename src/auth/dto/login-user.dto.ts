import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUser {
  @IsString()
  @IsNotEmpty()
  usrn: string;

  @IsString()
  @IsNotEmpty()
  pass: string;
}
