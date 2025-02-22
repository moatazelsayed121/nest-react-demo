import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth-guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body(new ValidationPipe()) signInDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    // TODO
    const { access_token } = await this.authService.signIn(signInDto);
    response.cookie('auth_token', access_token, {
      httpOnly: true,
      secure: true, // Secure only in production
      sameSite: 'none', // Adjust based on behavior
      path: '/', // Ensure cookie applies globally
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async signUp(
    @Body(new ValidationPipe()) signUpDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token } = await this.authService.signUp(signUpDto);
    response.cookie('auth_token', access_token, {});
  }

  @HttpCode(204)
  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('auth_token', { path: '/' });
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
