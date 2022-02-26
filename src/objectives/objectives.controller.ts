import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ObjectivesService } from './objectives.service';
import { CreateObjectiveDto } from './dto/create-objective.dto';
import { UpdateObjectiveDto } from './dto/update-objective.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetCurrentUser } from 'src/common/decorators';

@Controller('objectives')
@UseGuards(JwtAuthGuard)
export class ObjectivesController {
  constructor(private readonly objectivesService: ObjectivesService) {}

  @Post()
  create(
    @GetCurrentUser('sub') userId: string,
    @Body() createObjectiveDto: CreateObjectiveDto,
  ) {
    return this.objectivesService.create(userId, createObjectiveDto);
  }

  @Get('')
  find(
    @GetCurrentUser('sub') userId: string,
    @Query('id') id: string,
    @Query('field') field: string,
  ) {
    return this.objectivesService.find(userId, id, field);
  }

  @Get(':id')
  findOne(@GetCurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.objectivesService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @GetCurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() updateObjectiveDto: UpdateObjectiveDto,
  ) {
    return this.objectivesService.update(userId, id, updateObjectiveDto);
  }

  @Delete(':id')
  delete(@GetCurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.objectivesService.delete(userId, id);
  }
}
