import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';

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
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: synchronize,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
