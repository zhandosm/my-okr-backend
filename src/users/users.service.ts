import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    try {
      if (await this.doesUserExists(createUserDto))
        throw new ConflictException(
          'User with following username or email exists',
        );
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
      createUserDto.password = hash;
      const newUser = new this.userModel(createUserDto);
      const savedUser = await newUser.save();
      return savedUser;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findOne({ $_id: id }).lean();
    if (!user) throw new NotFoundException("User doesn't exist");
    return user;
  }

  async findOne(username: string): Promise<User> {
    const orQuery = [{ username: username }, { email: username }];
    const user = await this.userModel.findOne({ $or: orQuery }).lean();
    if (!user) throw new NotFoundException("User doesn't exist");
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async doesUserExists(createUserDTO: CreateUserDto): Promise<boolean> {
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
