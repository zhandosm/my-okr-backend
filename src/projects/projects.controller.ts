import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateProjectDto } from './dto/update-project.dto';
import { GetCurrentUser } from 'src/common/decorators';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(
    @GetCurrentUser('sub') userId: string,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectsService.create(userId, createProjectDto);
  }

  @Get('')
  find(@GetCurrentUser('sub') userId: string) {
    return this.projectsService.find(userId);
  }

  @Get(':id')
  findOne(@GetCurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.projectsService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @GetCurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() updateObjectiveDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(userId, id, updateObjectiveDto);
  }

  @Delete(':id')
  delete(@GetCurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.projectsService.delete(userId, id);
  }
}
