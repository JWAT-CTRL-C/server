import { IsOptional, IsString } from 'class-validator';

export class UpdateResourceDTO {
  @IsOptional()
  @IsString()
  resrc_name: string;
  @IsOptional()
  @IsString()
  resrc_url: string;
}
