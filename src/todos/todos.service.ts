import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ToDo, ToDoDocument } from './models/todo.model';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(ToDo.name)
    private toDoModel: Model<ToDoDocument>,
  ) {}

  async create(userId: string, createToDoDto: CreateTodoDto): Promise<ToDo> {
    try {
      await this.duplicateValidation(createToDoDto.title);
      createToDoDto['userId'] = userId;
      const newObjective = new this.toDoModel(createToDoDto);
      return newObjective.save();
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async duplicateValidation(title: string, id?: string): Promise<void> {
    interface findQuery {
      title: string;
      id?: string;
    }
    const query: findQuery = { title: title };
    if (id) {
      query['_id'] = { $ne: id };
    }
    const result = await this.toDoModel.findOne(query);
    if (!!result) {
      throw new ConflictException(`To-do "${title}" already exists`);
    }
  }

  async find(
    userId: string,
    id: string | Types.ObjectId,
    field: string,
  ): Promise<ToDo[]> {
    try {
      interface findByQuery {
        userId: string;
        projectId?: string | Types.ObjectId;
        objectiveId?: string | Types.ObjectId;
        keyResultId?: string | Types.ObjectId;
      }
      const query: findByQuery = { userId: userId };
      switch (field) {
        case 'project':
          query['projectId'] = id;
          break;
        case 'objective':
          query['objectiveId'] = id;
          break;
        case 'keyresult':
          query['keyResultId'] = id;
          break;
        default:
          null;
      }
      const toDos = await this.toDoModel.find(query).sort({ _id: -1 });
      return toDos;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findOne(userId: string, id: string) {
    try {
      const toDo = await this.toDoModel
        .findOne({ _id: id, userId: userId })
        .lean();
      if (!toDo) throw new NotFoundException("To-do doesn't exist");
      return toDo;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async update(
    userId: string,
    id: string,
    updateToDoDto: UpdateTodoDto,
  ): Promise<ToDo> {
    try {
      if (
        updateToDoDto.status !== undefined &&
        !['0', '1', '2'].includes(updateToDoDto.status)
      ) {
        throw new BadRequestException('Invalid status field');
      }
      await this.duplicateValidation(updateToDoDto.title, id);
      const update = await this.toDoModel.findOneAndUpdate(
        { _id: id, userId: userId },
        updateToDoDto,
        { new: true },
      );
      if (!update) {
        throw new NotFoundException("To-do doesn't exist");
      }
      return update;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async delete(userId: string, id: string) {
    try {
      const deleteOperation = await this.toDoModel.deleteOne({
        _id: id,
        userId: userId,
      });
      if (!deleteOperation.deletedCount) {
        throw new NotFoundException("To-do doesn't exist");
      }
      return deleteOperation;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
