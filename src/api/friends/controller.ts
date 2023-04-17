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
import { RecordStatus } from '../../type/RecordStatus';

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
  @Post('/change_record_status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  handleRecord(
    @Body()
    recordParams: {
      groupId: number;
      recordId: number;
      status: RecordStatus.Accept | RecordStatus.Reject;
      rejectReason?: string;
    },
    @Req() req: Request,
  ): Promise<any> {
    const { id } = req.user;
    const { groupId, recordId, status, rejectReason } = recordParams;
    return this.friendsService.handleContactRecord(
      id,
      groupId,
      recordId,
      status,
      rejectReason,
    );
  }
  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  getRecords(@Req() req: Request) {
    const { id } = req.user;
    return this.friendsService.getRecords(id);
  }
  @Get('/contacts')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  getContacts(@Req() req: Request) {
    const { id } = req.user;
    return this.friendsService.getContact(id);
  }
}
