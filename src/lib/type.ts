import { User } from 'src/entity/user.entity';

export type RolesType = 'MA' | 'HM' | 'PM' | 'EM';

export type DecodeUser = Pick<User, 'user_id' | 'usrn' | 'role'>;
