import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ToDo, ToDoDocument } from './models/todo.model';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(ToDo.name)
    private keyResultModel: Model<ToDoDocument>,
  ) {}

  async create(userId: string, createToDoDto: CreateTodoDto): Promise<ToDo> {
    if (await this.checkKeyResultDuplicate(createToDoDto))
      throw new ConflictException(
        `To-do ${createToDoDto.title} already exists`,
      );
    createToDoDto['userId'] = userId;
    const newObjective = new this.keyResultModel(createToDoDto);
    return newObjective.save();
  }

  async checkKeyResultDuplicate(
    createToDoDto: CreateTodoDto,
  ): Promise<boolean> {
    return !!(await this.keyResultModel.findOne({
      title: createToDoDto.title,
    }));
  }

  async find(userId: string, id: string, field: string): Promise<ToDo[]> {
    interface findByQuery {
      userId: string;
      projectId?: string;
      objectiveId?: string;
      keyResultId?: string;
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
        query[''] = id;
    }
    const toDos = await this.keyResultModel.find(query);
    return toDos;
  }

  async findOne(userId: string, id: string) {
    const toDo = await this.keyResultModel
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
      updateToDoDto.status !== '0' &&
      updateToDoDto.status !== '1' &&
      updateToDoDto.status !== '2'
    ) {
      throw new BadRequestException('Invalid status field');
    }
    const update = await this.keyResultModel.findOneAndUpdate(
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
    const deleteOperation = await this.keyResultModel.deleteOne({
      _id: id,
      userId: userId,
    });
    if (!deleteOperation.deletedCount) {
      throw new NotFoundException("To-do doesn't exist");
    }
    return deleteOperation;
  }
}
