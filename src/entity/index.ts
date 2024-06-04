import { Tag } from './tag.entity';
import { User } from './user.entity';
import { BlogComment, BlogImage, BlogRating, Blog } from './blog.entity';
import { Workspace } from './workspace.entity';
import { Source } from './source.entity';
import { Notification } from './notification.entity';

export const entities = [
  User,
  Tag,
  Blog,
  BlogImage,
  BlogComment,
  BlogRating,
  Source,
  Workspace,
  Notification,
];
