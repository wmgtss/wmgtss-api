import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TopicsModule } from './topics/topics.module';
import { PostsModule } from './posts/posts.module';
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
  imports: [configModule, dbModule, UsersModule, AuthModule, TopicsModule, PostsModule],
  controllers: [AppController],
})
export class AppModule {}
