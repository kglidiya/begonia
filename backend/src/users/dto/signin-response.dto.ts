import { Matches } from 'class-validator';

export class SigninUserResponseDto {
  @Matches('^[A-Za-z0-9_-]{2,}(?:.[A-Za-z0-9_-]{2,}){2}$')
  access_token: string;
}
