import { User } from 'src/entity/user.entity';

export type RolesType = 'MA' | 'HM' | 'PM' | 'EM';

export type DecodeUser = Pick<User, 'user_id' | 'usrn' | 'role'>;

export type JwtPayload = DecodeUser & {
  iat: number;
  exp: number;
};

export type RegisterUser = Pick<User, 'usrn' | 'role' | 'pass'>;
export type LoginUser = Pick<User, 'usrn' | 'pass'>;
