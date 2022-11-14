import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPublic } from './user-public.interface';
import { UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>
  ) {}

  _parseUserDetails(user: UserDocument): UserPublic {
    return {
      id: user._id,
      email: user.email,
    };
  }
  
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(email: string, hashedPassword: string): Promise<UserDocument> {
    const user = new this.userModel({
      email,
      password: hashedPassword
    })

    return user.save();
  }
}
