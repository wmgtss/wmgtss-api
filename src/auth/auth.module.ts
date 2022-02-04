import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt/jwt.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PwnedMiddleware } from './middleware/pwned.middleware';
import { LocalStrategy } from './strategy/local/local.strategy';

const jwtModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    return {
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    };
  },
  inject: [ConfigService],
});

@Module({
  imports: [UsersModule, PassportModule, jwtModule],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PwnedMiddleware).forRoutes('auth/signup');
  }
}
