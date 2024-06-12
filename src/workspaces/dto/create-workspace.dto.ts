import { IsNotEmpty, IsNumber, isString, IsString } from 'class-validator';
export class CreateWorkspaceDTO {
  @IsNotEmpty()
  @IsString()
  wksp_name: string;

  @IsNotEmpty()
  @IsString()
  wksp_desc: string;
}
