import { randomUUID } from 'crypto';
import type { User } from '../types/user.ts';
import { BadRequestError, NotFoundError } from '../types/errors.ts';

class UserStorage {
  users: User[] = [];

  isUUID = (value: string): boolean => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    );
  };

  findUser(userId: string) {
    if (!this.isUUID(userId)) throw new BadRequestError();
    const index = this.users.findIndex((value) => value.id == userId);
    if (index === -1) throw new NotFoundError();
    return index;
  }

  getUsers(userId?: string) {
    if (userId) {
      const index = this.findUser(userId);
      return this.users[index];
    }
    return this.users;
  }

  createUser(body: string) {
    const obj = JSON.parse(body);
    const result = {
      ...obj,
      id: randomUUID(),
    };
    this.users.push(result);
    return obj;
  }

  deleteUser(userId: string) {
    const index = this.findUser(userId);
    this.users.splice(index, 1);
    return;
  }

  updateUser(userId: string, body: string) {
    const index = this.findUser(userId);
    let user = this.users[index]!;

    const obj = JSON.parse(body);
    user = {
      ...user,
      ...obj,
      id: user.id,
    };
    this.users[index] = user;
    return user;
  }
}

export { UserStorage };
