import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import config from './config';

async function createApp() {
  if (config().HTTPS) {
    const fs = require('fs');
    return await NestFactory.create(AppModule, {
      httpsOptions: {
        key: fs.readFileSync('./secrets/benchilcott.com.key'),
        cert: fs.readFileSync('./secrets/benchilcott.com.pem'),
      },
    });
  } else {
    return await NestFactory.create(AppModule);
  }
}

async function bootstrap() {
  const app = await createApp();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('WMG: TSS API')
    .setDescription('API for the WMG Teaching Support System')
    .setVersion('1.0')
    .addTag('Resources')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('', app, document);

  await app.listen(config().PORT);
}

bootstrap();
