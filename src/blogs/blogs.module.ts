import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from 'src/entity/blog.entity';
import { BlogImage } from 'src/entity/blog-image.entity';
import { User } from 'src/entity/user.entity';
import { Tag } from 'src/entity/tag.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Workspace } from 'src/entity/workspace.entity';
import { Resource } from 'src/entity/resource.entity';
import { BlogComment } from 'src/entity/blog-comment.entity';
import { BlogRating } from 'src/entity/blog-rating.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Blog,
      Tag,
      BlogImage,
      Workspace,
      Resource,
      BlogComment,
      BlogRating,
    ]),
    CloudinaryModule,
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
