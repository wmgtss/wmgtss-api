import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import config from './config';

// TODO: Add swagger: https://docs.nestjs.com/openapi/introduction

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    UserModule,
    PostModule,
  ],
})
export class AppModule {}
