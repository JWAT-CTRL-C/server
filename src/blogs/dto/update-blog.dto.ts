import { PartialType } from '@nestjs/swagger';
import { CreateBlogDTO } from './create-blog.dto';

export class UpdateBlogDTO extends PartialType(CreateBlogDTO) {}
