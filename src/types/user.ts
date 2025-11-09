import { UUID } from 'crypto';

export type User = {
  id: string | UUID;
  username: string;
  age: number;
  hobbies: string[];
};
