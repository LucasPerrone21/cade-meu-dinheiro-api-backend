import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(env.APP_PORT);
  console.log(
    `🚀 Server is running on port ${env.APP_PORT} in ${env.APP_ENVIRONMENT} mode.`,
  );
}

void bootstrap();
