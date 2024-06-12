import { IsNotEmpty, IsString } from 'class-validator';

export class AddResourceDTO {
  @IsNotEmpty()
  @IsString()
  wksp_id: string;
  @IsNotEmpty()
  @IsString()
  resrc_name: string;
  @IsNotEmpty()
  @IsString()
  resrc_url: string;
}
