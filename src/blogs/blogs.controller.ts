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
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { BlogsService } from './blogs.service';
import { CreateBlogDTO } from './dto/create-blog.dto';
import { UpdateBlogDTO } from './dto/update-blog.dto';
import { User } from 'src/decorator/user.decorator';
import { DecodeUser } from 'src/lib/type';

@Controller('blogs')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-user-id',
  required: true,
})
@ApiTags('Blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          example: 'title',
          type: 'string',
        },
        content: {
          example: 'content',
          type: 'string',
        },
        tags: {
          example: ['tag1', 'tag2'],
          type: 'array',
          items: {
            type: 'string',
          },
        },
        blog_img_url: {
          example: 'https://example.com/image.jpg',
          type: 'string',
        },
      },
      required: ['title', 'content'],
    },
  })
  create(@Body() createBlogDTO: CreateBlogDTO, @User() user: DecodeUser) {
    return this.blogsService.createBlog(createBlogDTO, user);
  }

  @Post('upload-image')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.blogsService.uploadImage(file);
  }

  @Get(':blog_id')
  @ApiParam({
    name: 'blog_id',
    type: 'string',
    required: true,
  })
  findOne(@Param('blog_id') id: string) {
    return this.blogsService.findBlogByID(id);
  }

  @Patch(':blog_id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          example: 'title',
          type: 'string',
        },
        content: {
          example: 'content',
          type: 'string',
        },
        tags: {
          example: ['tag1', 'tag2'],
          type: 'array',
          items: {
            type: 'string',
          },
        },
        blog_img_url: {
          example: 'https://example.com/image.jpg',
          type: 'string',
        },
      },
    },
  })
  update(
    @Param('blog_id') blog_id: string,
    @Body() updateBlogDTO: UpdateBlogDTO,
  ) {
    return this.blogsService.update(blog_id, updateBlogDTO);
  }

  @Delete(':blog_id')
  @ApiParam({
    name: 'blog_id',
    type: 'string',
    required: true,
  })
  remove(@Param('blog_id') blog_id: string) {
    return this.blogsService.remove(blog_id);
  }

  @Get()
  async findAll() {
    return await this.blogsService.findAll();
  }

  @Get('for/user')
  async findAllByUserId(@User() user: DecodeUser) {
    return await this.blogsService.findAllByUserId(user);
  }
}
