import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './config/env';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos que não estão no DTO
      forbidNonWhitelisted: true, // lança erro se vier campo extra
      transform: true, // converte os tipos automaticamente (string → number, etc.)
    }),
  );

  const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_DB,
  } = process.env;

  const DATABASE_URL = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

  await app.listen(env.APP_PORT);
  console.log(
    `🚀 Server is running on port ${env.APP_PORT} in ${env.APP_ENVIRONMENT} mode.`,
  );

  console.log(`📦 Connected to database at ${DATABASE_URL}`);
}

void bootstrap();
