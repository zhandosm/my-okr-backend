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
import { KeyResultsService } from './keyresults.service';
import { CreateKeyResultDto } from './dto/create-keyresult.dto';
import { UpdateKeyResultDto } from './dto/update-keyresult.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('keyresults')
@UseGuards(JwtAuthGuard)
export class KeyResultsController {
  constructor(private readonly keyResultsService: KeyResultsService) {}

  @Post()
  create(@Body() createKeyResultDto: CreateKeyResultDto) {
    return this.keyResultsService.create(createKeyResultDto);
  }

  @Get('user/:id')
  findByUser(@Param('id') id: string) {
    return this.keyResultsService.findByUser(id);
  }

  @Get('project/:id')
  findByProject(@Param('id') id: string) {
    return this.keyResultsService.findByProject(id);
  }

  @Get('objective/:id')
  findByObjective(@Param('id') id: string) {
    return this.keyResultsService.findByObjective(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.keyResultsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateKeyResultDto: UpdateKeyResultDto,
  ) {
    return this.keyResultsService.update(+id, updateKeyResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.keyResultsService.remove(+id);
  }
}
