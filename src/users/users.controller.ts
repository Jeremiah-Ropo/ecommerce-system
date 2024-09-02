import {
  Controller,
  Get,
  ParseIntPipe,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminGuard } from './utils/authenticator.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // get all users
  @Get()
  @UseGuards(AdminGuard)
  async getAllUsers(
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('username') username?: string,
    @Query('email') email?: string,
    @Query('role') role?: string,
  ) {
    try {
      const query = {};
      if (username) query['username'] = username;
      if (email) query['email'] = email;
      if (role) query['role'] = role;
      return this.usersService.findAll(query, { limit, page });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // ban user by id
  @Patch('update/:id')
  @UseGuards(AdminGuard)
  async updateUserById(
    @Param('id') id: string,
    @Body() banned: { banned: boolean },
  ) {
    try {
      const user = await this.usersService.findById(id);
      console.log(user);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return this.usersService.updateById(id, banned);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
