import { Module } from '@nestjs/common';
import { KeyResultsService } from './keyresults.service';
import { KeyResultsController } from './keyresults.controller';
import { KeyResult, KeyResultSchema } from './models/keyresult.model';
import { MongooseModule } from '@nestjs/mongoose';
import { TodosModule } from '../todos/todos.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: KeyResult.name, schema: KeyResultSchema },
    ]),
    TodosModule,
  ],
  controllers: [KeyResultsController],
  providers: [KeyResultsService],
  exports: [KeyResultsService],
})
export class KeyResultsModule {}
