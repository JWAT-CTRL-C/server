import { User } from 'src/entity/user.entity';

export type RolesType = 'MA' | 'HM' | 'PM' | 'EM';

export type DecodeUser = Pick<User, 'user_id' | 'usrn'>;

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
