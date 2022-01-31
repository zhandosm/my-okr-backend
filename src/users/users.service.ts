import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from './models/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (await this.doesUserExists(createUserDto)) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'User with following username or email exists',
        },
        HttpStatus.CONFLICT,
      );
    }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
    createUserDto.password = hash;
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async findOne(id: string, username: string, email: string): Promise<User> {
    if (!id && !username && !email) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Invalid query parameters',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const orQuery = [];
    id ? orQuery.push({ _id: id }) : null;
    username ? orQuery.push({ username: username }) : null;
    email ? orQuery.push({ email: email }) : null;
    const user = await this.userModel
      .findOne({ $or: orQuery }, { _id: 0 })
      .lean();
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async doesUserExists(createUserDTO: CreateUserDto): Promise<any> {
    const user = await this.userModel.findOne({
      $or: [
        { email: createUserDTO.email },
        { username: createUserDTO.username },
      ],
    });
    if (user) {
      return true;
    }
    return false;
  }
}
