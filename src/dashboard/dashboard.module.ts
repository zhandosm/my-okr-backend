import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { UsersModule } from '../users/users.module';
import { ProjectsModule } from '../projects/projects.module';
import { ObjectivesModule } from '../objectives/objectives.module';

@Module({
  imports: [UsersModule, ProjectsModule, ObjectivesModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
