import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthUserDto } from '../users/dto/auth-user.dto';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { User } from 'src/users/entities/user.entity';
import { UserResponseDto } from 'src/users/dto/response-user.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  signin(@Body() data: AuthUserDto): Promise<UserResponseDto> {
    return this.authService.signIn(data);
  }

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.authService.signUp(createUserDto);
  }

  @Post('forgot-password')
  forgotpass(@Body() data: { email: string }): Promise<User> {
    return this.authService.forgotpassword(data.email);
  }

  @Post('reset-password')
  otp(@Body() data: { recoveryCode: number; password: string }): Promise<User> {
    const { recoveryCode, password } = data;
    return this.authService.resetPassword(recoveryCode, password);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
