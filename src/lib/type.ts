import { User } from 'src/entity/user.entity';

export type RolesType = 'MA' | 'HM' | 'PM' | 'EM';

export type DecodeUser = Pick<User, 'user_id' | 'usrn' | 'role'>;

export type JwtPayload = DecodeUser & {
  iat: number;
  exp: number;
};

export type TokenPair = {
  access_token: string;
  refresh_token: string;
};

export type KeyPair = {
  public_key: string;
  private_key: string;
};

export enum NotificationType {
  SETUP_USER = 'setup_user',
  SETUP_WORKSPACE = 'setup_workspace',
  CREATE_GLOBAL = 'create_global_notification',
  CREATE_WORKSPACE = 'create_workspace_notification',
  CREATE_SYSTEM_GLOBAL = 'create_system_global_notification',
  CREATE_SYSTEM_WORKSPACE = 'create_system_workspace_notification',
  NEW = 'new_notification',
  CREATE_RATING = 'create_rating_notification',
  SUCCESS = 'success_notification',
  ERROR = 'error_notification',
}
