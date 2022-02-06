import { Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-guard.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Req() req: Request): object {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/check')
  getAuth(): boolean {
    return true;
  }
}
