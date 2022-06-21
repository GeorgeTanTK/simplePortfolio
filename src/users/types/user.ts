import 'reflect-metadata';
import { Exclude } from 'class-transformer';

export interface User {
  id: number;
  password: string;
  username: string;
}

export class SerialisedUser {
  id: number;
  username: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<SerialisedUser>) {
    Object.assign(this, partial);
  }
}
