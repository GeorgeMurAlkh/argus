import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UserDTO } from './../user/user.dto'
import { UserPublic } from 'src/user/user-public.interface';


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async passwordsMatch(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async register(user: Readonly<UserDTO>): Promise<UserPublic> {
    const { email, password } = user;

    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) {
      throw new HttpException(
        'Email already used!',
        HttpStatus.CONFLICT
      )
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userService.create(email, hashedPassword);
    return this.userService._parseUserDetails(newUser);
  }

  async login(user: UserDTO): Promise<{token: string} | null> {
    const { email, password } = user;
    console.log(email)
    console.log(password)


    const existingUser = await this.userService.findByEmail(email);

    if (!existingUser) {
      throw new HttpException(
        'Wrong email!', 
        HttpStatus.UNAUTHORIZED
      );
    }

    const passwordsMatch = await this.passwordsMatch(
      password,
      existingUser.password,
    );

    if (!passwordsMatch) {
      throw new HttpException(
        'Wrong password!', 
        HttpStatus.UNAUTHORIZED
      );
    }

    console.log(existingUser)

    const jwt = await this.jwtService.signAsync({ user: existingUser });
    return { token: jwt };
  }

  async verifyJwt(jwt: string): Promise<{ exp: number }> {
    try {
      const { exp, iat } = await this.jwtService.verifyAsync(jwt);
      return {
        exp
      }
    } catch (error) {
      throw new HttpException(
        'Wrong JWT', 
        HttpStatus.UNAUTHORIZED
        );
    }
  }
}
