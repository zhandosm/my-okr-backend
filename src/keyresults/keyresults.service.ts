import { Injectable } from '@nestjs/common';
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
    if (await this.checkObjectiveDuplicate(createObjectiveDto))
      throw new ConflictException(
        `Objective ${createObjectiveDto.title} already exists`,
      );
    const newObjective = new this.objectiveModel(createObjectiveDto);
    return newObjective.save();
  }
  
  async checkObjectiveDuplicate(
    createObjectiveDto: CreateObjectiveDto,
  ): Promise<boolean> {
    return !!(await this.objectiveModel.findOne({
      title: createObjectiveDto.title,
    }));
  }

  create(createKeyResultDto: CreateKeyResultDto) {
    return 'This action adds a new keyresult';
  }

  findByUser
  findByProject
  findByObjective

  findOne(id: number) {
    return `This action returns a #${id} keyresult`;
  }

  update(id: number, updateKeyResultDto: UpdateKeyResultDto) {
    return `This action updates a #${id} keyresult`;
  }

  remove(id: number) {
    return `This action removes a #${id} keyresult`;
  }
}
