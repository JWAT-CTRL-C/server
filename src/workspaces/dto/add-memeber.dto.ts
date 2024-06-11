import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddMemberDto{
    @IsNotEmpty()
    @IsNumber()
    user_id: number;
}