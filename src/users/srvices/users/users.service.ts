import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, User as UserEntity } from 'src/typeorm';
import { encodePassword } from 'src/utils/bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto';
import { UserBuyDto } from 'src/users/dto/buy.dto';
import { AuthService } from 'src/auth/services/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  todayDate(): string {
    const d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    return (
      [year, month, day].join('-') +
      ' ' +
      d.getHours() +
      ':' +
      d.getMinutes() +
      ':' +
      d.getSeconds()
    );
  }

  getusers() {
    const action = 'CREATE';
    return this.userRepository.findBy({ action });
  }

  findUserByUsername(username: string): Promise<User> {
    const action = 'CREATE';
    return this.userRepository.findOneBy({ username, action });
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  createUser(increateUserDto: CreateUserDto) {
    const password = encodePassword(increateUserDto.password);
    const created_datetime = this.todayDate();
    const action = 'CREATE';
    const newUser = this.userRepository.create({
      ...increateUserDto,
      password,
      action,
      created_datetime,
    });
    return this.userRepository.save(newUser);
  }

  //   validateUser(inBuyDto: UserBuyDto) {
  //     return this.authService.validateUserTF(
  //       inBuyDto.username,
  //       inBuyDto.password,
  //     );
  //   }
  userBuy(inBuyDto: UserBuyDto) {
    const created_datetime = this.todayDate();
    const action = 'BUY';
    const shareCode = inBuyDto.shareCode.toUpperCase();
    const newUser = this.userRepository.create({
      ...inBuyDto,
      action,
      created_datetime,
      shareCode,
    });
    return this.userRepository.save(newUser);
  }

  usersell(inBuyDto: UserBuyDto) {
    const created_datetime = this.todayDate();
    const action = 'SELL';
    const shareCode = inBuyDto.shareCode.toUpperCase();
    const newUser = this.userRepository.create({
      ...inBuyDto,
      action,
      created_datetime,
      shareCode,
    });
    return this.userRepository.save(newUser);
  }

  showUserTransaction(username: string) {
    return this.userRepository.find({
      where: [
        { username, action: 'BUY' },
        { username, action: 'SELL' },
      ],
    });
  }

  async cleanHistoryOutput(username: string) {
    const history = await this.showUserTransaction(username);
    const returnArr = Array<cleanReturnHistory>();
    for (let i = 0; i < history.length; i++) {
      const val = new cleanReturnHistory();
      val.shareCode = history[i].shareCode;
      val.price = history[i].price;
      val.quantity = history[i].quantity;
      val.action = history[i].action;
      val.dateTime = history[i].created_datetime;
      returnArr.push(val);
    }
    return returnArr;
  }
}
export class cleanReturnHistory {
  shareCode: string;
  price: number;
  quantity: number;
  action: string;
  dateTime: string;
}
