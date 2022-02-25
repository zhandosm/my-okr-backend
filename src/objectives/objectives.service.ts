import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateObjectiveDto } from './dto/create-objective.dto';
import { UpdateObjectiveDto } from './dto/update-objective.dto';
import { Objective, ObjectiveDocument } from './models/objective.model';

@Injectable()
export class ObjectivesService {
  constructor(
    @InjectModel(Objective.name)
    private objectiveModel: Model<ObjectiveDocument>,
  ) {}

  async create(createObjectiveDto: CreateObjectiveDto): Promise<Objective> {
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

  async findByUser(userId: string): Promise<Objective[]> {
    const objectives = await this.objectiveModel.find({ userId: userId });
    return objectives;
  }

  async findByProject(projectId: string): Promise<Objective[]> {
    const objectives = await this.objectiveModel.find({ projectId: projectId });
    return objectives;
  }

  async findOne(id: string) {
    const objective = await this.objectiveModel.findOne({ _id: id }).lean();
    if (!objective) throw new NotFoundException("Objective doesn't exist");
    return objective;
  }

  async update(
    id: string,
    updateObjectiveDto: UpdateObjectiveDto,
  ): Promise<Objective> {
    const update = await this.objectiveModel.findOneAndUpdate(
      { _id: id },
      updateObjectiveDto,
      { new: true },
    );
    if (!update) {
      throw new NotFoundException("Objective doesn't exist");
    }
    return update;
  }

  async delete(id: string) {
    const deleteOperation = await this.objectiveModel.deleteOne({ _id: id });
    if (!deleteOperation.deletedCount) {
      throw new NotFoundException("Objective doesn't exist");
    }
    return deleteOperation;
  }
}
