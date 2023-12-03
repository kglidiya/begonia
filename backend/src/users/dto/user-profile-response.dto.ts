import { IsEmail, IsNumber, IsDate } from 'class-validator';

export class UserProfileResponseDto {
  @IsNumber()
  id: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsEmail()
  email: string;
}
