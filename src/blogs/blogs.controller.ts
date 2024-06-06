import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { User } from 'src/decorator/user.decorator';
import { DecodeUser } from 'src/lib/type';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  create(@Body() createBlogDto: CreateBlogDto, @User() user: DecodeUser) {
    return this.blogsService.createBlog(createBlogDto, user);
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.blogsService.uploadImage(file);
  }

  @Get(':blog_id')
  findOne(@Param('blog_id') id: string) {
    return this.blogsService.findBlogByID(id);
  }

  @Patch(':blog_id')
  update(
    @Param('blog_id') blog_id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogsService.update(blog_id, updateBlogDto);
  }

  @Delete(':blog_id')
  remove(@Param('blog_id') blog_id: string) {
    return this.blogsService.remove(blog_id);
  }
}
