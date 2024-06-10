import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ChangePassDTO {
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  oldPass: string;

  @IsString()
  @IsNotEmpty()
  newPass: string;
}
