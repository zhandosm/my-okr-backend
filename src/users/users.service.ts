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

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
