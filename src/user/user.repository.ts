import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly model: Model<UserDocument>,
  ) {}

  async create(data: CreateUserDto) {
    return this.model.create(data);
  }

  async findByEmail(email: string) {
    return this.model.findOne({ email }).exec();
  }

  async findById(id: string) {
    return this.model.findById(id).exec();
  }

  async findAll() {
    return this.model.find().exec();
  }
}
