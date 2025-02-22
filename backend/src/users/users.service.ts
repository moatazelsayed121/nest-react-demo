import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../database/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    return user;
  }

  async register(userRegisterDto: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const createdUser = new this.userModel(userRegisterDto);
    return createdUser.save();
  }
}
