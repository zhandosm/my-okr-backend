import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { PinProjectDto } from './dto/pin-project.dto';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './models/project.model';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    if (await this.doesProjectExists(createProjectDto))
      throw new ConflictException(
        `Project ${createProjectDto.title} already exists`,
      );
    const newUser = new this.projectModel(createProjectDto);
    return newUser.save();
  }

  async doesProjectExists(
    createProjectDto: CreateProjectDto,
  ): Promise<boolean> {
    const project = await this.projectModel.findOne({
      title: createProjectDto.title,
    });
    if (project) {
      return true;
    }
    return false;
  }

  async findOneByUserId(id: string): Promise<Project> {
    const project = await this.projectModel.findOne({ userId: id }).lean();
    if (!project) throw new NotFoundException("Project doesn't exist");
    return project;
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectModel.findOne({ _id: id }).lean();
    if (!project) throw new NotFoundException("Project doesn't exist");
    return project;
  }

  async pinProject(id: string, pinProjectDto: PinProjectDto) {
    const update = await this.projectModel.updateOne(
      { _id: id },
      { isPinned: pinProjectDto.isPinned },
    );
    if (!update.modifiedCount) {
      throw new NotFoundException("Project doesn't exist");
    }
    return update;
  }

  async delete(id: string) {
    const deleteOperation = await this.projectModel.deleteOne({ _id: id });
    if (!deleteOperation.deletedCount) {
      throw new NotFoundException("Project doesn't exist");
    }
    return deleteOperation;
  }
}
