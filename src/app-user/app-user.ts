import * as bcrypt from 'bcrypt';
import { AppUser } from '@prisma/client';
import { AppUserDto } from './types';
import { pick } from 'lodash';

export const appUserMixin = {
  async validatePassword(pass: string) {
    return bcrypt.compare(pass, (this as AppUser).bcryptPassword);
  },

  toDto(): AppUserDto {
    return pick(this as AppUser, ['uid', 'mobile']);
  },
};
