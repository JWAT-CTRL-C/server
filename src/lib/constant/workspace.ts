import { selectResources } from './resource';

export const selectWorkspace = {
  wksp_id: true,
  wksp_name: true,
  wksp_desc: true,
  crd_at: true,
  upd_at: true,

  owner: true,
  users: true,
  blogs: true,
  resources: true,
  notifications: true,
};

export const selectShortWorkspace = {
  wksp_id: true,
  wksp_name: true,
  wksp_desc: true,
  crd_at: true,
  upd_at: true,
};

export const relationWorkspace = {
  owner: true,
  users: true,
  blogs: true,
  resources: true,
  notifications: true,
};
export const selectBasicWorkspace = {
  wksp_id: true,
  wksp_name: true,
  wksp_desc: true,
  users: {
    user_id: true,
    usrn: true,
    role: true,
    fuln: true,
    email: true,
  },
};
export const selectUserRelation = {
  user_id: true,
  usrn: true,
  role: true,
};
export const selectOneWorkspace = {
  ...selectBasicWorkspace,
  owner: {
    ...selectUserRelation,
  },
  resources: {
    ...selectResources,
  },
};
export const workspaceBasicCondition = {
  deleted_at: null,
};
export const relationWithUser = {
  users: true,
};

export const relationWithOwner = {
  owner: true,
};
export const relationWithBlog = {
  blogs: true,
};
export const relationWithResources = {
  resources: true,
};
export const relationWithNotifications = {
  notifications: true,
};
export const relationWithWorkspace = {
  workspaces: true,
};
export const defaultCondition = {
  deleted_at: null,
};
