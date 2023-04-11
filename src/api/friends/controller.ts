import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { FriendsService } from './service';
import { CreateFriendsRequestDto } from './dtos/create-friends-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  create(
    @Body() createFriendsRequestDto: CreateFriendsRequestDto,
  ): Promise<any> {
    return this.friendsService.create(createFriendsRequestDto);
  }
}
