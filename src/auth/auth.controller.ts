import { Controller, Post, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-guard.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req): object {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/check')
  getAuth(): boolean {
    return true;
  }
}
