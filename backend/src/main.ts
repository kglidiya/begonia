require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
// import * as cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.use(
    helmet({
      crossOriginResourcePolicy: true,
    }),
  );
  // const corsOptions = {
  //   exposedHeaders: ['X-Total-Count'],
  // };
  // app.enableCors(corsOptions);
  console.log(process.env.PORT)
  await app.listen(PORT);
}
bootstrap();




