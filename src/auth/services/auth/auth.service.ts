import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/srvices/users/users.service';
import { comparePassword, encodePassword } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UsersService,
  ) {}

  async validateUser(username: string, password: string) {
    const userDB = await this.userService.findUserByUsername(username);
    if (userDB) {
      const matched = comparePassword(password, userDB.password);
      if (matched) {
        console.log('success');
        return userDB;
      }
    } else {
      console.log('fail');
      return null;
    }
  }
}
