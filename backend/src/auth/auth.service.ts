import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthUserDto } from '../users/dto/auth-user.dto';
import { hashPassword, verifyHash } from 'src/utils/bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/users/entities/user.entity';
import { UserResponseDto } from 'src/users/dto/response-user.dto';
import { Role } from 'src/users/entities/role.enum';

let recoveryCode: number;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly mailerService: MailerService
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const userExists = await this.usersService.findOneByEmail(
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

  async signIn(data: AuthUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.findOneByEmail(data.email);
    if (!user)
      throw new BadRequestException('Такой пользователь не зарегистрирован');

    const passwordMatches = await verifyHash(data.password, user.password);

    if (!passwordMatches) throw new UnauthorizedException('Неверный пароль');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return {
      ...rest,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }

  hashData(data: string): Promise<string> {
    return hashPassword(data);
  }

  async refreshTokens(
    userId: number,
    refreshToken: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new ForbiddenException('Пользователь не зарегистирован');
    const refreshTokenMatches = await verifyHash(
      user.refreshToken,
      refreshToken
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string
  ): Promise<User> {
    const hashedRefreshToken = await this.hashData(refreshToken);
    return await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken
    });
  }

  async getTokens(
    userId: number,
    email: string,
    role: Role
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '3h'
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
          expiresIn: '6d'
        }
      )
    ]);

    return {
      accessToken,
      refreshToken
    };
  }

  async forgotpassword(email: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);
    recoveryCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    if (!user) throw new BadRequestException('Пользователь не найден');
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: this.configService.get<string>('MAILDEV_INCOMING_USER'),
        subject: 'Восстановление пароля',
        text: 'Ваш код для восстановления пароля',
        html: `<b>Ваш код для восстановления пароля</b>
               <b>${recoveryCode}</b>`
      });
      return await this.usersService.update(user.id, { recoveryCode });
    } catch (e) {
      console.log(e);
    }
  }

  async resetPassword(recoveryCode: number, password: string): Promise<User> {
    if (recoveryCode) {
      const user = await this.usersService.findOneByRecoveryCode(recoveryCode);
      if (!user) {
        throw new BadRequestException('Введен некорректный код');
      }
      return await this.usersService.update(user.id, { password });
    }
  }
}
