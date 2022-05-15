import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './models/project.model';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(
    userId: string,
    createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    await this.duplicateValidation(createProjectDto.title);
    createProjectDto['userId'] = userId;
    const newUser = new this.projectModel(createProjectDto);
    return newUser.save();
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

  async find(userId: string): Promise<Project[]> {
    interface findByQuery {
      userId: string;
    }
    const query: findByQuery = { userId: userId };
    const toDos = await this.projectModel.find(query);
    return toDos;
  }

  async findOne(userId: string, id: string): Promise<Project> {
    const project = await this.projectModel
      .findOne({ _id: id, userId: userId })
      .lean();
    if (!project) throw new NotFoundException("Project doesn't exist");
    return project;
  }

  async update(
    userId: string,
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
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
  }

  async delete(userId: string, id: string) {
    const deleteOperation = await this.projectModel.deleteOne({
      _id: id,
      userId: userId,
    });
    if (!deleteOperation.deletedCount) {
      throw new NotFoundException("Project doesn't exist");
    }
    return deleteOperation;
  }
}
