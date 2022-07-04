import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MongoooseExceptionFilter } from './common/filters/mongoose-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new MongoooseExceptionFilter());
  // CORS
  app.enableCors({
    origin: ['http://localhost:8080', 'http://localhost:3030'],
    credentials: true,
    methods: ['GET, POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', '*', 'Authorization'],
  });
  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('MyOKR')
    .setDescription('MyOKR Backend APIs Documentation')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(8080);
}
bootstrap();
