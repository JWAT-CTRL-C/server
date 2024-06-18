import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { RolesType } from 'src/lib/type';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  usrn: string;

  @IsString()
  @IsIn(['MA', 'HM', 'PM', 'EM'])
  @IsOptional()
  role: RolesType;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  fuln: string;

  @IsPhoneNumber('VN')
  @IsOptional()
  phone: number;

  @IsString()
  @IsNotEmpty()
  pass: string;
}
