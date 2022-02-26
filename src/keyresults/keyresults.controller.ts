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
import { KeyResultsService } from './keyresults.service';
import { CreateKeyResultDto } from './dto/create-keyresult.dto';
import { UpdateKeyResultDto } from './dto/update-keyresult.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetCurrentUser } from 'src/common/decorators';

@Controller('keyresults')
@UseGuards(JwtAuthGuard)
export class KeyResultsController {
  constructor(private readonly keyResultsService: KeyResultsService) {}

  @Post()
  create(
    @GetCurrentUser('sub') userId: string,
    @Body() createKeyResultDto: CreateKeyResultDto,
  ) {
    return this.keyResultsService.create(userId, createKeyResultDto);
  }

  @Get('')
  find(
    @GetCurrentUser('sub') userId: string,
    @Query('id') id: string,
    @Query('field') field: string,
  ) {
    return this.keyResultsService.find(userId, id, field);
  }

  @Get(':id')
  findOne(@GetCurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.keyResultsService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @GetCurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() updateKeyResultDto: UpdateKeyResultDto,
  ) {
    return this.keyResultsService.update(userId, id, updateKeyResultDto);
  }

  @Delete(':id')
  delete(@GetCurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.keyResultsService.delete(userId, id);
  }
}
