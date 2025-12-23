import { IsString, IsNumber, IsEmail, Min, IsOptional, IsBoolean, ValidateIf } from 'class-validator';

export class CreateBetDto {
  @IsString()
  description: string;

  @ValidateIf(o => !o.isPublic)
  @IsEmail()
  friendEmail?: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsNumber()
  avaliadorId?: number;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
