import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthUserDto } from '../users/dto/auth-user.dto';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) { }
  
  @Post('signin')
  signin(@Body() data: AuthUserDto) {
    return this.authService.signIn(data);
  }

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {

    return this.authService.signUp(createUserDto);
  }

  @Post('forgot-password')
  forgotpass(@Body() data: any) {
    return this.authService.forgotpassword(data.email);
  }

  @Post('reset-password')
  otp(@Body() data: any) {
    const { recoveryCode, password } = data
    return this.authService.resetPassword(recoveryCode, password);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
