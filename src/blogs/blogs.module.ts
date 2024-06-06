import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from 'src/entity/blog.entity';
import { BlogImage } from 'src/entity/blog-image.entity';
import { User } from 'src/entity/user.entity';
import { Tag } from 'src/entity/tag.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Blog, Tag, BlogImage]),
    CloudinaryModule,
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
