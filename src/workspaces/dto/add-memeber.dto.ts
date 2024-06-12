import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddMemberDTO {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
