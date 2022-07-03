import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { isValidObjectId, Model, Mongoose, Types } from 'mongoose';
import { Project, ProjectDocument } from './models/project.model';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ObjectivesService } from 'src/objectives/objectives.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    private objectivesService: ObjectivesService,
  ) {}

  async create(
    userId: string,
    createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    try {
      await this.duplicateValidation(createProjectDto.title);
      createProjectDto['userId'] = userId;
      const newUser = new this.projectModel(createProjectDto);
      return newUser.save();
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
    const result = await this.projectModel.findOne(query);
    if (!!result) {
      throw new ConflictException(`Project "${title}" already exists`);
    }
  }

  async find(userId: string | Types.ObjectId): Promise<Project[]> {
    try {
      interface findByQuery {
        userId: string | Types.ObjectId;
      }
      const query: findByQuery = { userId: userId };
      const projects = await this.projectModel.find(query);
      return projects;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findOne(userId: string, id: string): Promise<Project> {
    try {
      const project = await this.projectModel
        .findOne({ _id: new Types.ObjectId(id), userId: userId })
        .lean();
      if (!project) throw new NotFoundException("Project doesn't exist");
      const objectives = await this.objectivesService.find(
        userId,
        id,
        'project',
      );
      project['objectives'] = objectives;
      return project;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async update(
    userId: string,
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    try {
      await this.duplicateValidation(updateProjectDto.title, id);
      const update = await this.projectModel.findOneAndUpdate(
        { _id: id, userId: userId },
        updateProjectDto,
        { new: true },
      );
      if (!update) {
        throw new NotFoundException("Project doesn't exist");
      }
      return update;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async delete(userId: string, id: string) {
    try {
      const deleteOperation = await this.projectModel.deleteOne({
        _id: id,
        userId: userId,
      });
      if (!deleteOperation.deletedCount) {
        throw new NotFoundException("Project doesn't exist");
      }
      return deleteOperation;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
