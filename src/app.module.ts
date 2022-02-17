import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { ObjectivesModule } from './objectives/objectives.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_CONNECTION_URL),
    UsersModule,
    AuthModule,
    ProjectsModule,
    ObjectivesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
