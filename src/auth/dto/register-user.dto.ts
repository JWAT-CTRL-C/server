import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';
import { RolesType } from 'src/lib/type';

export class RegisterUserDTO {
  @IsString()
  @IsNotEmpty()
  usrn: string;

  @IsString()
  @IsOptional()
  @IsIn(['MA', 'HM', 'PM', 'EM'])
  role: RolesType;

  @IsString()
  @IsNotEmpty()
  pass: string;
}
