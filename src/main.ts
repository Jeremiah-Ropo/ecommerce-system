import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    );
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  });
  app.use(
    cors({
      origin: '*',
      methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
      credentials: true,
    }),
  );
  await app.listen(3000);
  const logger = new Logger(AppModule.name);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
