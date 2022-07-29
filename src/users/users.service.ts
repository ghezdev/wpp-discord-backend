import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  getHello(): string {
    return 'Hello world!';
  }

  async getByUser(name: string) {
    try {
      const user = await this.userModel.findOne({ name }).exec();

      if (!user) {
        return 'User not found';
      }

      return user;
    } catch (error) {
      return new Error(error.message);
    }
  }

  async create(name: string, message: string) {
    try {
      const user = new this.userModel({ name, message });

      await user.save();

      return user;
    } catch (error) {
      return new Error(error.message);
    }
  }

  async getAll() {
    try {
      const users = await this.userModel.find({}).exec();

      return users;
    } catch (error) {
      return new Error(error.message);
    }
  }
}
