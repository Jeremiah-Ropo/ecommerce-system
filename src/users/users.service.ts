import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(userDto: any): Promise<User> {
    const userPayload = {
      username: userDto.username,
      password: userDto.password,
      email: userDto.email,
      role: userDto.role,
    };
    const user = await this.userModel.create(userPayload);
    return user;
  }

  async findAll(query: any, { page, limit }): Promise<User[]> {
    const users = await this.userModel
      .find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();
    return users;
  }

  async findOne(query: any): Promise<User> {
    const user = await this.userModel.findOne(query).exec();
    return user;
  }

  async updateById(id: any, payload: any): Promise<User> {
    console.log(id, payload);
    const updatedUser = await this.userModel
      .findByIdAndUpdate({_id: id}, payload, { new: true })
      .exec();
    return updatedUser;
  }

  async findById(id: any): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    return user;
  }

  async deleteById(id: any): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    return deletedUser;
  }
}
