import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { GetCurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(
    @GetCurrentUser('sub') userId: string,
    @Body() createTodoDto: CreateTodoDto,
  ) {
    return this.todosService.create(userId, createTodoDto);
  }

  @Get('')
  find(
    @GetCurrentUser('sub') userId: string,
    @Query('id') id: string,
    @Query('field') field: string,
  ) {
    return this.todosService.find(userId, id, field);
  }

  @Get(':id')
  findOne(@GetCurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.todosService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @GetCurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(userId, id, updateTodoDto);
  }

  @Delete(':id')
  delete(@GetCurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.todosService.delete(userId, id);
  }
}
