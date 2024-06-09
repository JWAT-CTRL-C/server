import { createHash } from 'crypto';

type entityName = 'blog' | 'source' | 'workspace' | 'notification' | 'blog_img';

export const hashMD5 = (data: string) => {
  return createHash('md5').update(data).digest('hex');
};

export const generateUUID = (entityName: entityName, ownerID: number) => {
  switch (entityName) {
    case 'blog':
      return `${ownerID}-${hashMD5(entityName)}-${Date.now()}`;
    case 'notification':
      return `${ownerID}-${hashMD5(entityName)}-${Date.now()}`;
    case 'source':
      return `${ownerID}-${hashMD5(entityName)}-${Date.now()}`;
    case 'workspace':
      return `${new Date().getFullYear()}-${hashMD5(entityName)}-${Date.now()}`;
    default:
      return `${ownerID}-${hashMD5(entityName)}-${Date.now()}`;
  }
};
