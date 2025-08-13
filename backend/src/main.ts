import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cors from 'cors';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });

  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(json());
  app.use(urlencoded({ extended: false }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // Ignore extra fields like bill_address, bill_city, etc., instead of throwing 400
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port as number);
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`);
}

bootstrap();


