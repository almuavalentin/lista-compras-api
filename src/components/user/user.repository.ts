import { Role, User } from './user.model';

export interface NewUser {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export const findByEmail = (email: string): Promise<User | null> =>
  User.findOne({ where: { email } });

export const create = (data: NewUser): Promise<User> => User.create(data);
