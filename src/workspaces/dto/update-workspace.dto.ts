import { PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateWorkspaceDto } from './create-workspace.dto';

export class UpdateWorkspaceDto {
  @IsNotEmpty()
  @IsString()
  wksp_name: string;

  @IsNotEmpty()
  @IsString()
  wksp_desc: string;
}
