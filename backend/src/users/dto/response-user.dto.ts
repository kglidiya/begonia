import { IsDate, IsEmail, IsEnum, IsNumber, Matches } from 'class-validator';
import { Role } from '../entities/role.enum';

export class UserResponseDto {
  @IsNumber()
  id: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsEmail()
  email: string;

  @IsNumber()
  recoveryCode: number;

  @Matches('^[A-Za-z0-9_-]{2,}(?:.[A-Za-z0-9_-]{2,}){2}$')
  refreshToken: string;

  @IsEnum({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Matches('^[A-Za-z0-9_-]{2,}(?:.[A-Za-z0-9_-]{2,}){2}$')
  accessToken?: string;
}
