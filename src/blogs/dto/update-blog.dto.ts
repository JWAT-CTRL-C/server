import { PartialType } from '@nestjs/swagger';
import { CreateBlogDTO } from './create-blog.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateBlogDTO extends PartialType(CreateBlogDTO) {
  @IsString()
  @IsOptional()
  blog_tle: string;

  @IsString()
  @IsOptional()
  blog_cont: string;

  @IsArray()
  @IsOptional()
  tags: string[];

  @IsString()
  @IsOptional()
  resrc_id: string;
}
