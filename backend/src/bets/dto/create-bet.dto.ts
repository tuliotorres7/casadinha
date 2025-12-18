import { IsString, IsNumber, IsEmail, Min } from 'class-validator';

export class CreateBetDto {
  @IsString()
  description: string;

  @IsEmail()
  friendEmail: string;

  @IsNumber()
  @Min(1)
  amount: number;
}
