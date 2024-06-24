import { createHash } from 'crypto';
import { Blog } from 'src/entity/blog.entity';
import { DecodeUser } from './type';

type entityName =
  | 'blog'
  | 'resource'
  | 'workspace'
  | 'notification'
  | 'blog_img'
  | 'blog-comment'
  | 'blog-rating';

export const hashMD5 = (data: string) => {
  return createHash('md5').update(data).digest('hex');
};

export const generateUUID = (
  entityName: entityName,
  ownerID: number | string,
) => {
  switch (entityName) {
    case 'blog':
      return `${ownerID}-${hashMD5(entityName)}-${Date.now()}`;
    case 'blog-comment':
      return `${ownerID}-${hashMD5(entityName)}-${Date.now()}`;
    case 'blog-rating':
      return `${ownerID}-${hashMD5(entityName)}-${Date.now()}`;
    case 'notification':
      return `${ownerID}-${hashMD5(entityName)}-${Date.now()}`;
    case 'resource':
      return `${ownerID}-${hashMD5(entityName)}-${Date.now()}`; //owner is workspace that contains it
    case 'workspace':
      return `${new Date().getFullYear()}-${hashMD5(entityName)}-${Date.now()}`;
    default:
      return `${ownerID}-${hashMD5(entityName)}-${Date.now()}`;
  }
};

export const getRandomBlogs = (blogs: Blog[], count: number) => {
  const shuffled = blogs.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const canPassThrough = <T = unknown>(
  user: DecodeUser,
  {
    onApprove,
    onDecline,
  }: {
    onApprove: T;
    onDecline: T;
  },
) => {
  return ['MA', 'HM'].includes(user.role) ? onApprove : onDecline;
};
