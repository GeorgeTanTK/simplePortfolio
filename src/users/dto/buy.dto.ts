import { IsNotEmpty, MinLength } from 'class-validator';

export class UserBuyDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(10)
  password: string;

  @IsNotEmpty()
  shareCode: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  quantity: number;
}
