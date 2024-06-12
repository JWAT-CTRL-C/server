import { Optional } from '@nestjs/common';
import { IsString } from 'class-validator';

export class UpdateResourceDTO {
  @Optional()
  @IsString()
  resrc_name: string;
  @Optional()
  @IsString()
  resrc_url: string;
}
