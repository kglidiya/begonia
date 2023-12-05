import {
  BadRequestException,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthUserDto } from '../users/dto/auth-user.dto';
import { hashPassword, verifyHash } from 'src/utils/bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { Role } from 'src/auth/roles/roles.emun';

let recoveryCode;
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly mailerService: MailerService
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const userExists = await this.usersService.findOneWithPassword(
      createUserDto.email
    );
    if (userExists) {
      throw new BadRequestException(
        'Такой пользователь уже зарегистрирован. Выполните вход'
      );
    }
    const newUser = await this.usersService.create({
      ...createUserDto
    });
    const tokens = await this.getTokens(
      newUser.id,
      newUser.email,
      newUser.role
    );
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return {
      ...newUser,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }

  async signIn(data: AuthUserDto) {
    const user = await this.usersService.findOneWithPassword(data.email);
    if (!user) throw new BadRequestException('Такой пользователь не зарегистрирован');
  
    const passwordMatches = await verifyHash(data.password, user.password);
    
    if (!passwordMatches) throw new BadRequestException('Неверный пароль');
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    const { password, ...rest } = user;
    return {
      ...rest,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }

  // async logout(id: number) {
  //   return this.usersService.update({refreshToken: '' }, id);
  // }

  hashData(data: string) {
    return hashPassword(data);
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    // if (!user) throw new ForbiddenException('Пользователь не зарегистирован');
    // const refreshTokenMatches = await verifyHash(
    //   user.refreshToken,
    //   refreshToken,
    // );
    // if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    const user = await this.usersService.findOne(userId);
    await this.usersService.update(
      { ...user, refreshToken: hashedRefreshToken },
      userId
    );
  }

  async getTokens(userId: number, email: string, role: any) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '1d'
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d'
        }
      )
    ]);

    return {
      accessToken,
      refreshToken
    };
  }

  async forgotpassword(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    recoveryCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    if (!user) throw new BadRequestException('User does not exist');
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: 'lgkosinova@gmail.com',
        subject: 'Восстановление пароля',
        text: 'Ваш код для восстановления пароля',
        html: `<b>Ваш код для восстановления пароля</b>
               <b>${recoveryCode}</b>`
      });
      return await this.usersService.update({ recoveryCode }, user.id);
    } catch (e) {
      console.log(e);
    }
  }

  async resetPassword(recoveryCode: number, password: string) {
    if (recoveryCode) {
      const user = await this.usersService.findOneByRecoveryCode(recoveryCode);
      if (!user) {
        throw new BadRequestException('Введен некорректный код');
      }
      return await this.usersService.update({ password }, user.id);
    }
  }
}
