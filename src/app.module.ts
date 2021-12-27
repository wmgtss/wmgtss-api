import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';

import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import config from './config';

const configModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [config],
});

const dbModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => configService.get('DATABASE'),
  inject: [ConfigService],
});

@Module({
  imports: [configModule, dbModule, UserModule, PostModule, AuthModule],
  controllers: [AppController],
})
export class AppModule {}
