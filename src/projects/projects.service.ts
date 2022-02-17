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
    return !!(await this.projectModel.findOne({
      title: createProjectDto.title,
    }));
  }

  async findByUserId(userId: string): Promise<Project[]> {
    const projects = await this.projectModel.find({ userId: userId });
    return projects;
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectModel.findOne({ _id: id }).lean();
    if (!project) throw new NotFoundException("Project doesn't exist");
    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const update = await this.projectModel.findOneAndUpdate(
      { _id: id },
      updateProjectDto,
      { new: true },
    );
    if (!update) {
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
