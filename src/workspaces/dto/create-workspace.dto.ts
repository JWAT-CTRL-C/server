import { IsNotEmpty, IsNumber, isString, IsString } from 'class-validator';
export class CreateWorkspaceDto {
  @IsNotEmpty()
  @IsString()
  wksp_name: string;

  @IsNotEmpty()
  @IsString()
  wksp_desc: string;
}
