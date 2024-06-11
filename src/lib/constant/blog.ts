import { selectTag } from './tag';
import { selectUser } from './user';

export const relationsBlog = {
  user: true,
  tags: true,
  blogImage: true,
  blogComments: true,
  blogRatings: true,

  workspace: {
    resources: true,
  },
};

export const selectBlogImage = {
  blog_img_id: true,
  blog_img_url: true,
};

export const selectBlogComments = {
  blog_cmt_id: true,
  blog_cmt_cont: true,
  crd_at: true,
  upd_at: true,
  user: selectUser,
};

export const selectBlogRatings = {
  blog_rtg_id: true,
  is_rated: true,
  crd_at: true,
  upd_at: true,
  user: selectUser,
};

export const selectBlog = {
  blog_id: true,
  blog_tle: true,
  blog_cont: true,
  crd_at: true,
  upd_at: true,
  blogImage: selectBlogImage,
  blogComments: selectBlogComments,
  blogRatings: selectBlogRatings,
  user: selectUser,
  tags: selectTag,
};
