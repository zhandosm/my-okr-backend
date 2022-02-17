import { Module } from '@nestjs/common';
import { ObjectivesService } from './objectives.service';
import { ObjectivesController } from './objectives.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Objective, ObjectiveSchema } from './models/objective.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Objective.name, schema: ObjectiveSchema },
    ]),
  ],
  controllers: [ObjectivesController],
  providers: [ObjectivesService],
  exports: [ObjectivesService],
})
export class ObjectivesModule {}
