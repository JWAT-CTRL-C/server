import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBlogCommentDTO {
  @IsString()
  @IsNotEmpty()
  blog_cmt_cont: string;
}
