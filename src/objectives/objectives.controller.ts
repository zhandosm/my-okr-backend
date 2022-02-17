import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ObjectivesService } from './objectives.service';
import { CreateObjectiveDto } from './dto/create-objective.dto';
import { UpdateObjectiveDto } from './dto/update-objective.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('objectives')
// @UseGuards(JwtAuthGuard)
export class ObjectivesController {
  constructor(private readonly objectivesService: ObjectivesService) {}

  @Post()
  create(@Body() createObjectiveDto: CreateObjectiveDto) {
    return this.objectivesService.create(createObjectiveDto);
  }

  @Get('user/:id')
  findByUser(@Param('id') id: string) {
    return this.objectivesService.findByUser(id);
  }

  @Get('project/:id')
  findByProject(@Param('id') id: string) {
    return this.objectivesService.findByProject(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.objectivesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateObjectiveDto: UpdateObjectiveDto,
  ) {
    return this.objectivesService.update(id, updateObjectiveDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.objectivesService.delete(id);
  }
}
