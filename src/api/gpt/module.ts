import { Module } from '@nestjs/common';
import { GPTController } from './controller';
import { GPTService } from './service';

@Module({
  controllers: [GPTController],
  providers: [GPTService],
})
export class GPTModule {}
