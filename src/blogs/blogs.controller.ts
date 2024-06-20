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
  Query,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BlogsService } from './blogs.service';
import { CreateBlogDTO } from './dto/create-blog.dto';
import { UpdateBlogDTO } from './dto/update-blog.dto';
import { User } from 'src/decorator/user.decorator';
import { DecodeUser } from 'src/lib/type';
import { CreateBlogCommentDTO } from './dto/crete-blog-comment.dto';

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
        blog_tle: {
          example: 'title',
          type: 'string',
        },
        blog_cont: {
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
        resrc_id: {
          type: 'string',
        },
      },
    },
  })
  update(
    @Param('blog_id') blog_id: string,
    @Body() updateBlogDTO: UpdateBlogDTO,
    @User() user: DecodeUser,
  ) {
    return this.blogsService.update(blog_id, updateBlogDTO, user);
  }

  @Delete(':blog_id')
  @ApiParam({
    name: 'blog_id',
    type: 'string',
    required: true,
  })
  remove(@Param('blog_id') blog_id: string, @User() user: DecodeUser) {
    return this.blogsService.remove(blog_id, user);
  }

  @Get()
  async findAll() {
    return await this.blogsService.findAll();
  }

  @Get('for/user')
  async findAllByUserId(@User() user: DecodeUser) {
    return await this.blogsService.findAllByUserId(user);
  }

  @Get('filter/title')
  @ApiQuery({
    name: 'blog_tle',
    type: 'string',
    required: true,
  })
  async filterBlogByTitleForCurrentUser(
    @User() user: DecodeUser,
    @Query('blog_tle') blog_tle: string,
  ) {
    return await this.blogsService.filterBlogByTitleForCurrentUser(
      user,
      blog_tle,
    );
  }

  @Post(':blog_id/comments')
  @ApiParam({
    name: 'blog_id',
    type: 'string',
    required: true,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        blog_cmt_cont: {
          example: 'This a comment for a blog',
          type: 'string',
        },
      },
      required: ['blog_cmt_cont'],
    },
  })
  async createComment(
    @Body() createBlogCommentDTO: CreateBlogCommentDTO,
    @User() user: DecodeUser,
    @Param('blog_id') blog_id: string,
  ) {
    return await this.blogsService.createComment(
      createBlogCommentDTO,
      user,
      blog_id,
    );
  }

  @Get(':blog_id/comments')
  @ApiParam({
    name: 'blog_id',
    type: 'string',
    required: true,
  })
  async findAllCommentByBlogId(
    @User() user: DecodeUser,
    @Param('blog_id') blog_id: string,
  ) {
    return await this.blogsService.findAllCommentByBlogId(blog_id, user);
  }

  @Put(':blog_id/rating')
  @ApiParam({
    name: 'blog_id',
    type: 'string',
    required: true,
  })
  async ratingBlog(
    @User() user: DecodeUser,
    @Param('blog_id') blog_id: string,
  ) {
    return await this.blogsService.ratingBlog(blog_id, user);
  }

  @Get(':blog_id/rating')
  @ApiParam({
    name: 'blog_id',
    type: 'string',
    required: true,
  })
  async isRatingBlog(
    @User() user: DecodeUser,
    @Param('blog_id') blog_id: string,
  ) {
    return await this.blogsService.isRatingBlog(blog_id, user);
  }
}
