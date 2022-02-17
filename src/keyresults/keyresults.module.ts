import { Module } from '@nestjs/common';
import { KeyResultsService } from './keyresults.service';
import { KeyResultsController } from './keyresults.controller';
import { KeyResult, KeyResultSchema } from './models/keyresult.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: KeyResult.name, schema: KeyResultSchema },
    ]),
  ],
  controllers: [KeyResultsController],
  providers: [KeyResultsService],
  exports: [KeyResultsService],
})
export class KeyResultsModule {}
