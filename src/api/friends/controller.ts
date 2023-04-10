import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { FriendsService } from './service';
import { CreateFriendsRequestDto } from './dtos/create-friends-request.dto';

@Controller()
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Post()
  @HttpCode(200)
  create(
    @Body() createFriendsRequestDto: CreateFriendsRequestDto,
  ): Promise<any> {
    return this.friendsService.create(createFriendsRequestDto);
  }
}
