import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDTO {
  @IsString()
  @IsNotEmpty()
  usrn: string;

  @IsString()
  @IsNotEmpty()
  pass: string;
}
