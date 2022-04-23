import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateObjectiveDto } from './dto/create-objective.dto';
import { UpdateObjectiveDto } from './dto/update-objective.dto';
import { Objective, ObjectiveDocument } from './models/objective.model';
import { KeyResultsService } from '../keyresults/keyresults.service';

@Injectable()
export class ObjectivesService {
  constructor(
    @InjectModel(Objective.name)
    private objectiveModel: Model<ObjectiveDocument>,
    private keyResultsService: KeyResultsService,
  ) {}

  async create(
    userId: string,
    createObjectiveDto: CreateObjectiveDto,
  ): Promise<Objective> {
    try {
      await this.duplicateValidation(createObjectiveDto.title);
      createObjectiveDto['userId'] = userId;
      const newObjective = new this.objectiveModel(createObjectiveDto);
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
    const result = await this.objectiveModel.findOne(query);
    if (!!result) {
      throw new ConflictException(`Objective "${title}" already exists`);
    }
  }

  async find(
    userId: string,
    id: string | Types.ObjectId,
    field: string,
  ): Promise<Objective[]> {
    try {
      interface findByQuery {
        userId: string;
        projectId?: string | Types.ObjectId;
      }
      const query: findByQuery = { userId: userId };
      switch (field) {
        case 'project':
          query['projectId'] = id;
          break;
        default:
          null;
      }
      const objectives = await this.objectiveModel
        .find(query)
        .sort({ _id: -1 });
      return objectives;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findOne(userId: string, id: string) {
    try {
      const objective = await this.objectiveModel
        .findOne({ _id: new Types.ObjectId(id), userId: userId })
        .lean();
      if (!objective) throw new NotFoundException("Objective doesn't exist");
      const keyResults = await this.keyResultsService.find(
        userId,
        id,
        'projectId',
      );
      objective['keyResults'] = keyResults;
      return objective;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async update(
    userId: string,
    id: string,
    updateObjectiveDto: UpdateObjectiveDto,
  ): Promise<Objective> {
    try {
      await this.duplicateValidation(updateObjectiveDto.title, id);
      const update = await this.objectiveModel.findOneAndUpdate(
        { _id: id, userId: userId },
        updateObjectiveDto,
        { new: true },
      );
      if (!update) {
        throw new NotFoundException("Objective doesn't exist");
      }
      return update;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async delete(userId: string, id: string) {
    try {
      const deleteOperation = await this.objectiveModel.deleteOne({
        _id: id,
        userId: userId,
      });
      if (!deleteOperation.deletedCount) {
        throw new NotFoundException("Objective doesn't exist");
      }
      return deleteOperation;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
