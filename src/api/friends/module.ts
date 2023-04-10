import { Module } from '@nestjs/common';
import { FriendsController } from './controller';
import { FriendsService } from './service';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
