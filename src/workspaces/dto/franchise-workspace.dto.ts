import { IsNotEmpty, IsNumber } from 'class-validator';

export class FranchiseWorkspaceDTO {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
