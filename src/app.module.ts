import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './api/users/module';
import { User } from './entity/user.entity';
import { RedisModule } from 'nestjs-redis';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { EmailModule } from './email/module';
import { WsGateway } from './gateway/ws/ws.gateway';
import { AuthModule } from './api/auth/module';

// 环境变量加载
const envFilePath = ['env/.env'];
if (process.env.NODE_ENV) {
  envFilePath.unshift(`env/.env.${process.env.NODE_ENV}`);
}

@Module({
  imports: [
    //环境变量配置
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: envFilePath,
    }),
    //数据库设置
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
          logging: true,
          synchronize: synchronize,
        };
      },
    }),
    //redis设置
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
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { host, port, user, pass, defaultUser } =
          configService.get('email');
        return {
          transport: {
            host: host, //邮箱服务器地址
            port: port, //服务器端口 默认 465
            auth: {
              user: user, //你的邮箱地址
              pass: pass, //授权码
            },
          },
          preview: true, //是否开启预览，开启了这个属性，在调试模式下会自动打开一个网页，预览邮件
          defaults: {
            from: defaultUser, //发送人 你的邮箱地址
          },
          template: {
            // dir: path.join(process.cwd(), './src/template'),//这里就是你的模板文件夹路径
            //dir: __dirname + '/template',   //
            adapter: new PugAdapter(), //模板的
            options: {
              strict: true, //严格模式
            },
          },
        };
      },
    }),
    UsersModule,
    EmailModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, WsGateway],
})
export class AppModule {}
