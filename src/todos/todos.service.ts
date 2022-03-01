import {
  BadRequestException,
  ConflictException,
  Injectable,
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
    await this.duplicateValidation(createToDoDto.title);
    createToDoDto['userId'] = userId;
    const newObjective = new this.toDoModel(createToDoDto);
    return newObjective.save();
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
  }

  async findOne(userId: string, id: string) {
    const toDo = await this.toDoModel
      .findOne({ _id: id, userId: userId })
      .lean();
    if (!toDo) throw new NotFoundException("To-do doesn't exist");
    return toDo;
  }

  async update(
    userId: string,
    id: string,
    updateToDoDto: UpdateTodoDto,
  ): Promise<ToDo> {
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
  }

  async delete(userId: string, id: string) {
    const deleteOperation = await this.toDoModel.deleteOne({
      _id: id,
      userId: userId,
    });
    if (!deleteOperation.deletedCount) {
      throw new NotFoundException("To-do doesn't exist");
    }
    return deleteOperation;
  }
}
