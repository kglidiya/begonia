import { CreateUserDto } from './create-user.dto';
import { IsNumber, Matches } from 'class-validator';

export class UpdateUserDto extends CreateUserDto {
    @IsNumber()
    recoveryCode?: number;

    @Matches('^[A-Za-z0-9_-]{2,}(?:.[A-Za-z0-9_-]{2,}){2}$')
    refreshToken?: string;
}
