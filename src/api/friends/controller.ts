import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FriendsService } from './service';
import { CreateFriendsRequestDto } from './dtos/create-friends-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  create(
    @Body() createFriendsRequestDto: CreateFriendsRequestDto,
    @Req() req: Request,
  ): Promise<any> {
    const { id } = req.user;
    return this.friendsService.create(id, createFriendsRequestDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  getRecords(@Req() req: Request) {
    const { id } = req.user;
    return this.friendsService.getRecords(id);
  }
}
