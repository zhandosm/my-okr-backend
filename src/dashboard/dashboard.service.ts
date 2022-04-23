import { ConsoleLogger, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { ObjectivesService } from '../objectives/objectives.service';
import { User, UserDocument } from 'src/users/models/user.model';
import { Project } from 'src/projects/models/project.model';
import { Types } from 'mongoose';
import { Objective } from 'src/objectives/models/objective.model';

@Injectable()
export class DashboardService {
  constructor(
    private usersService: UsersService,
    private projectsService: ProjectsService,
    private objectivesService: ObjectivesService,
  ) {}

  async initialData(userId: string): Promise<any> {
    interface InitialData {
      user: { _id: Types.ObjectId; username: string };
      projects: { _id: Types.ObjectId; title: string; isPinned: boolean }[];
      initialProject: {
        _id: Types.ObjectId;
        title: string;
        objectives: Objective[];
      };
    }
    const userData: any = await this.usersService.findById(userId);
    const projects: Project[] = await this.projectsService.find(userId);
    let initialProject: Project = projects[0];
    for (const project of projects) {
      if (project.isPinned) initialProject = project;
    }
    const objectives = await this.objectivesService.find(
      userId,
      initialProject._id,
      'project',
    );
    const data: InitialData = {
      user: { _id: userData._id, username: userData.username },
      projects: projects.map((project) => {
        return {
          _id: project._id,
          title: project.title,
          isPinned: project.isPinned,
        };
      }),
      initialProject: {
        _id: initialProject._id,
        title: initialProject.title,
        objectives: objectives,
      },
    };
    return data;
  }
}
