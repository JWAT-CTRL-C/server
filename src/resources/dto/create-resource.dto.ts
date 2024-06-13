import { IsNotEmpty, IsString } from 'class-validator';

export class CreateResourceDTO {
  @IsNotEmpty()
  @IsString()
  resrc_name: string;
  @IsNotEmpty()
  @IsString()
  resrc_url: string;
}
