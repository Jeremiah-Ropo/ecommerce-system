import { Body, Controller, Post, HttpException, HttpStatus, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(
    @Body()
    user: RegisterDto,
  ) {
    const checkUser = await this.usersService.findOne({ email: user.email });
    if (checkUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    return this.authService.register(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() user: LoginDto) {
    const userExists = await this.usersService.findOne({ email: user.email });
    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (userExists.banned) {
      throw new HttpException('User is banned', HttpStatus.FORBIDDEN);
    }
    let checkPassword = await this.authService.decryptPassword(user.password, userExists.password);
    if (!checkPassword) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return this.authService.login(userExists);
  }
}
