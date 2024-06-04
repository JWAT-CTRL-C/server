import { SetMetadata } from '@nestjs/common';
import { ROLES_METADATA } from 'src/lib/constant';
import { RolesType } from 'src/lib/type';

export const Roles = (...roles: RolesType[]) =>
  SetMetadata(ROLES_METADATA, roles);
 
