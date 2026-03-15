import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './config/env';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos que não estão no DTO
      forbidNonWhitelisted: true, // lança erro se vier campo extra
      transform: true, // converte os tipos automaticamente (string → number, etc.)
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Cadê meu Dinheiro API')
    .setDescription('API para gerenciamento financeiro pessoal')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(env.APP_PORT, '0.0.0.0');
  console.log(
    `🚀 Server is running on port ${env.APP_PORT} in ${env.APP_ENVIRONMENT} mode.`,
  );
}

void bootstrap();
