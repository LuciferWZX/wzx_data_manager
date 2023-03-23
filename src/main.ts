import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfigType } from '../config/configuration';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<AppConfigType>);
  const { name, port, prefix, host } = configService.get('app');
  const logger: Logger = new Logger('main.ts');
  app.setGlobalPrefix(prefix);
  await app.listen(port, () => {
    logger.log(`
      [${name}]已经启动,接口请访问: 
      http://${host}:${port}/${prefix}
      http://${host}:${port}/${prefix}/graphiql
     `);
  });
}
bootstrap();
