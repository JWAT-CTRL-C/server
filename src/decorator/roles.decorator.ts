import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from 'src/lib/constant';
import { RolesType } from 'src/lib/type';

export const Roles = (...roles: RolesType[]) => SetMetadata(ROLES_KEY, roles);
