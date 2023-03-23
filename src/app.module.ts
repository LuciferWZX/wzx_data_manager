import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './api/users/module';
import { User } from './entity/user.entity';
import { RedisModule } from 'nestjs-redis';

// 环境变量加载
const envFilePath = ['env/.env'];
if (process.env.NODE_ENV) {
  envFilePath.unshift(`env/.env.${process.env.NODE_ENV}`);
}

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: envFilePath,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { type, host, port, username, password, database, synchronize } =
          configService.get('mysql');
        return {
          type: type,
          host: host,
          port: port,
          username: username,
          password: password,
          database: database,
          // entities: [__dirname + '/**/*.entity{.ts,.js}'],
          entities: [User],
          logger: 'debug',
          synchronize: synchronize,
        };
      },
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const { host, port, password } = configService.get('redis');
        return {
          url: `redis://:${password}@${host}:${port}`,
          onClientReady: (client) => {
            Logger.log('redis连接成功');
            client.on('error', (err) => {
              Logger.log('[redis:err]:', err);
            });
          },
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
