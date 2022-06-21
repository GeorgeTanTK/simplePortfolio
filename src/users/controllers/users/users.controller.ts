import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserBuyDto } from 'src/users/dto/buy.dto';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto';
import { UsersService } from 'src/users/srvices/users/users.service';
import { SerialisedUser } from 'src/users/types/user';
import { StringLiteral } from 'ts-morph';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UsersService,
  ) {}

  @Get('')
  getUsers() {
    return this.userService.getusers();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('username/:username')
  async getByUsername(@Param('username') username: string) {
    const userf = await this.userService.findUserByUsername(username);
    if (userf) return new SerialisedUser(userf);
    else throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
  }

  @Post('create_user')
  @UsePipes(ValidationPipe)
  async createUser(@Body() createuserDTO: CreateUserDto) {
    const checker = await this.userService.findUserByUsername(
      createuserDTO.username,
    );
    if (checker) throw new HttpException('User Exist', HttpStatus.BAD_REQUEST);
    else return this.userService.createUser(createuserDTO);
  }

  @Post(':username/buy')
  @UsePipes(ValidationPipe)
  async buy(
    @Body() userBuyDto: UserBuyDto,
    @Param('username') username: string,
  ) {
    const checker = await this.userService.findUserByUsername(username);
    if (username != userBuyDto.username)
      throw new HttpException('Input Error', HttpStatus.BAD_REQUEST);
    if (!checker)
      throw new HttpException('User Not Exist', HttpStatus.BAD_REQUEST);
    return this.userService.userBuy(userBuyDto);
  }

  @Post(':username/sell')
  @UsePipes(ValidationPipe)
  async sell(
    @Body() userBuyDto: UserBuyDto,
    @Param('username') username: string,
  ) {
    const checker = await this.userService.findUserByUsername(username);
    if (username != userBuyDto.username)
      throw new HttpException('Input Error', HttpStatus.BAD_REQUEST);
    if (!checker)
      throw new HttpException('User Not Exist', HttpStatus.BAD_REQUEST);
    return this.userService.usersell(userBuyDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':username/transactionHistory')
  async transactionHistory(@Param('username') username: string) {
    const userf = await this.userService.findUserByUsername(username);
    if (!userf)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    return this.userService.cleanHistoryOutput(username);
  }
}
