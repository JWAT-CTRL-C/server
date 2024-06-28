import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { RolesType } from 'src/lib/type';

export class UpdateProfileDTO {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  fuln: string;

  @IsPhoneNumber('VN')
  @IsOptional()
  phone: number;

  @IsString()
  @IsIn(['MA', 'HM', 'PM', 'EM'])
  @IsOptional()
  role: RolesType;
}
