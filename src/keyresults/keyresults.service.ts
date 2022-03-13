import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateKeyResultDto } from './dto/create-keyresult.dto';
import { UpdateKeyResultDto } from './dto/update-keyresult.dto';
import { KeyResult, KeyResultDocument } from './models/keyresult.model';
import { TodosService } from '../todos/todos.service';

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
    await this.duplicateValidation(createKeyResultDto.title);
    createKeyResultDto['userId'] = userId;
    const newObjective = new this.keyResultModel(createKeyResultDto);
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
    const toDos = await this.keyResultModel.find(query).sort({ _id: -1 });
    return toDos;
  }

  async findOne(userId: string, id: string) {
    const keyResult = await this.keyResultModel
      .findOne({ _id: new Types.ObjectId(id), userId: userId })
      .lean();
    if (!keyResult) throw new NotFoundException("Key result doesn't exist");
    const toDos = await this.todosService.find(userId, id, 'keyresult');
    keyResult['toDos'] = toDos;
    return keyResult;
  }

  async update(
    userId: string,
    id: string,
    updateKeyResultDto: UpdateKeyResultDto,
  ): Promise<KeyResult> {
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
  }

  async delete(userId: string, id: string) {
    const deleteOperation = await this.keyResultModel.deleteOne({
      _id: id,
      userId: userId,
    });
    if (!deleteOperation.deletedCount) {
      throw new NotFoundException("Key Result doesn't exist");
    }
    return deleteOperation;
  }
}
