import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import config from './config';

const logger = new Logger('Entrypoint');

async function createApp() {
  // If HTTPS is enabled, load certificate and key from files
  if (config().HTTPS) {
    logger.log('HTTPS is enabled, loading certificate from ./secrets');
    const fs = require('fs');
    return await NestFactory.create(AppModule, {
      httpsOptions: {
        key: fs.readFileSync('./secrets/wmgtss.com.key'),
        cert: fs.readFileSync('./secrets/wmgtss.com.pem'),
      },
    });
  } else {
    logger.log('HTTPS is disabled');
    return await NestFactory.create(AppModule);
  }
}

async function bootstrap() {
  const app = await createApp();
  const PORT = config().PORT;

  // Set up Swagger/OpenAPI for documentation
  // In production, this can be found at https://api.wmgtss.com/docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('WMG: TSS API')
    .setDescription('API for the WMG Teaching Support System')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  // Enable cookies and CORS
  app.use(cookieParser());
  app.enableCors({
    origin: config().REACT_URL,
    credentials: true,
  });

  // Listen on the port specified in the config
  await app.listen(PORT, () => {
    logger.log(`App listening at http://localhost:${PORT}`);
  });
}

bootstrap();
