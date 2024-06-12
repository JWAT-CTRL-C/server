import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddMemberDTO {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
