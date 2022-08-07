import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

import {NestExpressApplication} from "@nestjs/platform-express";
import {join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, "..", 'static'));
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('NESTJS_PORT');
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  await app.listen(PORT);
}
bootstrap();
