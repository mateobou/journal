import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // ignore les champs non définis dans le DTO
    forbidNonWhitelisted: true, // renvoie une erreur si on envoie des champs en trop
    transform: true, // transforme automatiquement la payload en instance de DTO
  }));

  await app.listen(3003);
}
bootstrap();