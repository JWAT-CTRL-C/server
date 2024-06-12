import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Like, Repository } from 'typeorm';

import { CreateBlogDTO } from './dto/create-blog.dto';
import { UpdateBlogDTO } from './dto/update-blog.dto';
import { DecodeUser } from 'src/lib/type';
import { User } from 'src/entity/user.entity';
import { Blog } from 'src/entity/blog.entity';
import { BlogImage } from 'src/entity/blog-image.entity';
import { Tag } from 'src/entity/tag.entity';
import { generateUUID } from 'src/lib/utils';
import { relationsBlog, selectBlog } from 'src/lib/constant/blog';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Workspace } from 'src/entity/workspace.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
    @InjectRepository(BlogImage)
    private readonly blogImageRepository: Repository<BlogImage>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
  ) {}

  async createBlog(createBlogDTO: CreateBlogDTO, user: DecodeUser) {
    const foundUser = await this.userRepository.findOne({
      where: { user_id: user.user_id },
    });

    if (!foundUser) throw new NotFoundException('User not found');

    const tags: Tag[] = [];

    let blog_image: BlogImage = undefined;

    if (createBlogDTO.blog_img_url) {
      blog_image = this.blogImageRepository.create({
        blog_img_id: generateUUID('blog_img', user.user_id),
        blog_img_url: createBlogDTO.blog_img_url,
      });
    }

    if (createBlogDTO.tags && createBlogDTO.tags.length) {
      const foundTags = await this.tagRepository.find({
        where: { tag_name: In(createBlogDTO.tags) },
      });

      if (foundTags.length !== createBlogDTO.tags.length) {
        const newTags: Tag[] = [];
        for (const tagName of createBlogDTO.tags) {
          if (!foundTags.find((tag) => tag.tag_name === tagName)) {
            const newTag = this.tagRepository.create({
              tag_name: tagName,
            });

            newTags.push(newTag);
            foundTags.push(newTag);
          }
        }
        await this.tagRepository.save(newTags);
      }

      tags.push(...foundTags);
    }

    const blog = this.blogRepository.create({
      ...createBlogDTO,
      blog_id: generateUUID('blog', user.user_id),
      user,
      workspace: { wksp_id: createBlogDTO.wksp_id },
      blogImage: blog_image,
      tags,
    });

    if (!blog) throw new InternalServerErrorException('Failed to create blog');

    blog_image.blog = blog;

    await Promise.all([
      this.blogImageRepository.save(blog_image),
      this.blogRepository.save(blog),
    ]);

    return { success: true, message: 'Blog created successfully' };
  }

  async uploadImage(file: Express.Multer.File) {
    const image = await this.cloudinaryService
      .uploadImage(file, 'blogs')
      .catch((e) => {
        console.log(e);
        throw new BadRequestException();
      });

    return {
      success: true,
      data: {
        public_id: image.public_id,
        url: image.url,
      },
    };
  }

  async findBlogByID(id: string) {
    const blog = await this.blogRepository.findOne({
      where: { blog_id: id },
      relations: relationsBlog,
      select: selectBlog,
    });

    return blog;
  }

  update(blog_id: string, updateBlogDTO: UpdateBlogDTO) {
    return `This action updates a #${blog_id} blog`;
  }

  async remove(blog_id: string) {
    await this.blogRepository.softDelete(blog_id);

    return `Delete blog with id #${blog_id} successfully`;
  }

  async findAll() {
    const blogs = await this.blogRepository.find({
      relations: relationsBlog,
    });
    return blogs;
  }

  async findAllByUserId(user: DecodeUser) {
    const foundUser = await this.userRepository.findOne({
      where: { user_id: user.user_id },
    });
    if (!foundUser) throw new NotFoundException('User not found');
    const blogs = await this.blogRepository.find({
      relations: relationsBlog,
      where: { user: { user_id: user.user_id } },
    });
    return blogs;
  }

  async filterBlogByTitleForCurrentUser(user: DecodeUser, title: string) {
    const foundUser = await this.userRepository.findOne({
      where: { user_id: user.user_id },
    });
    if (!foundUser) throw new NotFoundException('User not found');
    const foundBlogs = await this.blogRepository.find({
      where: {
        user: { user_id: user.user_id },
        blog_tle: ILike(`%${title}%`),
      },
      relations: relationsBlog,
    });
    return foundBlogs;
  }
}
