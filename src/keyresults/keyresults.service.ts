import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateKeyResultDto } from './dto/create-keyresult.dto';
import { UpdateKeyResultDto } from './dto/update-keyresult.dto';
import { KeyResult, KeyResultDocument } from './models/keyresult.model';

@Injectable()
export class KeyResultsService {
  constructor(
    @InjectModel(KeyResult.name)
    private keyResultModel: Model<KeyResultDocument>,
  ) {}

  async create(createKeyResultDto: CreateKeyResultDto): Promise<KeyResult> {
    if (await this.checkKeyResultDuplicate(createKeyResultDto))
      throw new ConflictException(
        `Key Result ${createKeyResultDto.title} already exists`,
      );
    const newObjective = new this.keyResultModel(createKeyResultDto);
    return newObjective.save();
  }

  async checkKeyResultDuplicate(
    createKeyResultDto: CreateKeyResultDto,
  ): Promise<boolean> {
    return !!(await this.keyResultModel.findOne({
      title: createKeyResultDto.title,
    }));
  }

  async findByUser(userId: string): Promise<KeyResult[]> {
    const keyResults = await this.keyResultModel.find({ userId: userId });
    return keyResults;
  }

  async findByProject(projectId: string): Promise<KeyResult[]> {
    const keyResults = await this.keyResultModel.find({ projectId: projectId });
    return keyResults;
  }

  async findByObjective(objectiveId: string): Promise<KeyResult[]> {
    const keyResults = await this.keyResultModel.find({
      objectiveId: objectiveId,
    });
    return keyResults;
  }

  async findOne(id: string) {
    const keyResult = await this.keyResultModel.findOne({ _id: id }).lean();
    if (!keyResult) throw new NotFoundException("Key result doesn't exist");
    return keyResult;
  }

  async update(
    id: string,
    updateKeyResultDto: UpdateKeyResultDto,
  ): Promise<KeyResult> {
    const update = await this.keyResultModel.findOneAndUpdate(
      { _id: id },
      updateKeyResultDto,
      { new: true },
    );
    if (!update) {
      throw new NotFoundException("Key Result doesn't exist");
    }
    return update;
  }

  async delete(id: string) {
    const deleteOperation = await this.keyResultModel.deleteOne({ _id: id });
    if (!deleteOperation.deletedCount) {
      throw new NotFoundException("Key Result doesn't exist");
    }
    return deleteOperation;
  }
}
