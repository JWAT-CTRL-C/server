import { selectUser } from './user';
import { selectShortWorkspace } from './workspace';

export const relationNotification = {
  user: true,
  workspace: true,
  userNotificationRead: true,
};

export const selectNotification = {
  noti_id: true,
  noti_tle: true,
  noti_cont: true,
  crd_at: true,
  upd_at: true,
  user: selectUser,
  workspace: selectShortWorkspace,
  userNotificationRead: {
    is_read: true,
    user_noti_read_id: true,
    user_id: true,
  },
};
