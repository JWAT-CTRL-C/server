import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UpdateProfileDTO {
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  fuln: string;

  @IsPhoneNumber('VN')
  @IsOptional()
  phone: number;
}
