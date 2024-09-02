import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { pbkdf2Sync } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findOne({ email });
      const decrypt = await this.decryptPassword(password, user.password);
      if (user && decrypt) {
        const { password, ...result } = user;
        return result;
      }
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async login(user: any) {   
      console.log(user);
    const payload = { email: user.email, id: user._id, role: user.role };
    let jwtOptions = {
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
      secret: this.configService.get('JWT_SECRET'),
    };
    return {
      access_token: this.jwtService.sign(payload, jwtOptions),
    };
  }

  async encryptPassword(password: string) {
    let salt = this.configService.get('PASSWORD_SALT');
    let hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { password: hash };
  }

  async decryptPassword(password: string, userPassword: string) {
    let salt = this.configService.get('PASSWORD_SALT');
    let hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    if (userPassword === hash) {
      return true;
    } else {
      return false;
    }
  }

  async register(user: {email: string, password: string, role: string, username: string}) {
      try {
      let hash = await this.encryptPassword(user.password);
        user.password = hash.password;
      const newUser = await this.usersService.create(user);
      return newUser;
    } catch (error) {
      return new HttpException(
        error.errorMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
