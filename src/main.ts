import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const fs = require('fs')

const httpsOptions = {
  key: fs.readFileSync('./secrets/benchilcott.com.key'),
  cert: fs.readFileSync('./secrets/benchilcott.com.pem'),
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
	httpsOptions,
  });
  await app.listen(443);
}
bootstrap();
