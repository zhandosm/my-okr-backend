import { MongooseModule } from '@nestjs/mongoose';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { ObjectivesModule } from './objectives/objectives.module';
import { KeyResultsModule } from './keyresults/keyresults.module';
import { TodosModule } from './todos/todos.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AppLoggerMiddleware } from './common/middlewares/http-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_CONNECTION_URL),
    UsersModule,
    AuthModule,
    ProjectsModule,
    ObjectivesModule,
    KeyResultsModule,
    TodosModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
