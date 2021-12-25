import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import config from './config';

const logger = new Logger('Entrypoint');

async function createApp() {
  if (config().HTTPS) {
    logger.log('HTTPS is enabled, loading certificate from ./secrets');
    const fs = require('fs');
    return await NestFactory.create(AppModule, {
      httpsOptions: {
        key: fs.readFileSync('./secrets/benchilcott.com.key'),
        cert: fs.readFileSync('./secrets/benchilcott.com.pem'),
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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('WMG: TSS API')
    .setDescription('API for the WMG Teaching Support System')
    .setVersion('1.0')
    .addTag('Resources')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(PORT, () => {
    logger.log(`App listening at http://localhost:${PORT}`);
  });
}

bootstrap();
