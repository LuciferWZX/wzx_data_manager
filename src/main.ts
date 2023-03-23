import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfigType } from '../config/configuration';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './filter/httpException';
import { TransformInterceptor } from './interceptor/transform';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<AppConfigType>);
  const { name, port, prefix: api, host, version } = configService.get('app');
  const logger: Logger = new Logger('main.ts');
  const prefix = `${api}/${version}`;
  app.setGlobalPrefix(prefix);
  // 成功拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  // 全局注册错误的过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port, () => {
    logger.log(`
      [${name}]已经启动,接口请访问: 
      http://${host}:${port}/${prefix}
     `);
  });
}
bootstrap();
