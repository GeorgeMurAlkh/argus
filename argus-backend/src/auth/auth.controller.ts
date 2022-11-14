import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserPublic } from 'src/user/user-public.interface';
import { UserDTO } from 'src/user/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() user: UserDTO): Promise<UserPublic | null> {
    return this.authService.register(user);
  }

  @Post('login')
  login(@Body() user: UserDTO): Promise<{ token: string } | null> {
    return this.authService.login(user);
  }

  @Post('jwt')
  jwt(@Body() payload: { jwt: string }) {
    return this.authService.verifyJwt(payload.jwt)
  }

}
