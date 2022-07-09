import { Controller, Post, Get, Req, UseGuards, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-guard.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Req() req: Request, @Res() res: Response): object {
    return this.authService.login(req.user, res);
  }

  @Post('/logout')
  logout(@Req() req: Request, @Res() res: Response): object {
    return this.authService.logout(req.user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/check')
  getAuth(): boolean {
    return true;
  }
}
