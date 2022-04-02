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
  app.enableCors({ origin: process.env.ORIGIN, credentials: true });
  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('MyOKR')
    .setDescription('MyOKR Backend APIs Documentation')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
