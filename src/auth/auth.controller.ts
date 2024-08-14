import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Request() req: any) {
    return this.authService.signIn(req.user);
  }

  @Public()
  @Post('signout')
  async signOut() {
    return this.authService.signOut();
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
