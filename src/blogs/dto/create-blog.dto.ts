import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBlogDTO {
  @IsString()
  @IsNotEmpty()
  blog_tle: string;

  @IsString()
  @IsNotEmpty()
  blog_cont: string;

  @IsString()
  @IsOptional()
  wksp_id: string;

  @IsString()
  @IsOptional()
  resrc_id: string;

  @IsArray()
  @IsOptional()
  tags: string[];

  @IsString()
  @IsOptional()
  blog_img_url: string;
}
