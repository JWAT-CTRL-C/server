import { IsNotEmpty, IsNumber } from "class-validator";

export class FranchiseWorkspaceDto {
    @IsNotEmpty()
    @IsNumber()
    user_id: number;
}