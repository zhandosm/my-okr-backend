import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateKeyResultDto } from './dto/create-keyresult.dto';
import { UpdateKeyResultDto } from './dto/update-keyresult.dto';
import { KeyResult, KeyResultDocument } from './models/keyresult.model';
import { TodosService } from '../todos/todos.service';
import { ToDo } from 'src/todos/models/todo.model';

@Injectable()
export class KeyResultsService {
  constructor(
    @InjectModel(KeyResult.name)
    private keyResultModel: Model<KeyResultDocument>,
    private todosService: TodosService,
  ) {}

  async create(
    userId: string,
    createKeyResultDto: CreateKeyResultDto,
  ): Promise<KeyResult> {
    try {
      await this.duplicateValidation(createKeyResultDto.title);
      createKeyResultDto['userId'] = userId;
      const newObjective = new this.keyResultModel(createKeyResultDto);
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
    const result = await this.keyResultModel.findOne(query);
    if (!!result) {
      throw new ConflictException(`Key Result "${title}" already exists`);
    }
  }

  async find(
    userId: string,
    id: string | Types.ObjectId,
    field: string,
  ): Promise<KeyResult[]> {
    try {
      interface findByQuery {
        userId: string;
        projectId?: string | Types.ObjectId;
        objectiveId?: string | Types.ObjectId;
      }
      const query: findByQuery = { userId: userId };
      switch (field) {
        case 'project':
          query['projectId'] = id;
          break;
        case 'objective':
          query['objectiveId'] = id;
          break;
        default:
          null;
      }
      const keyResults = await this.keyResultModel.find(query);
      return keyResults;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findOne(userId: string, id: string) {
    try {
      interface ClassifiedToDosObj {
        0: ToDo[];
        1: ToDo[];
        2: ToDo[];
      }

      const keyResult = await this.keyResultModel
        .findOne({ _id: new Types.ObjectId(id), userId: userId })
        .lean();
      if (!keyResult) throw new NotFoundException("Key result doesn't exist");
      const toDos = await this.todosService.find(userId, id, 'keyresult');
      const classifiedToDos: ClassifiedToDosObj = { 0: [], 1: [], 2: [] };
      for (const toDo of toDos) classifiedToDos[toDo.status].push(toDo);
      keyResult['toDos'] = classifiedToDos;
      return keyResult;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async update(
    userId: string,
    id: string,
    updateKeyResultDto: UpdateKeyResultDto,
  ): Promise<KeyResult> {
    try {
      await this.duplicateValidation(updateKeyResultDto.title, id);
      const update = await this.keyResultModel.findOneAndUpdate(
        { _id: id, userId: userId },
        updateKeyResultDto,
        { new: true },
      );
      if (!update) {
        throw new NotFoundException("Key Result doesn't exist");
      }
      return update;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async delete(userId: string, id: string) {
    try {
      const deleteOperation = await this.keyResultModel.deleteOne({
        _id: id,
        userId: userId,
      });
      if (!deleteOperation.deletedCount) {
        throw new NotFoundException("Key Result doesn't exist");
      }
      return deleteOperation;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
