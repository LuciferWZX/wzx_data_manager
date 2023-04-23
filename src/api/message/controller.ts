import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './service';
import { MessageType } from '../../type/message/MessageType';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { query, Request } from 'express';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  create(
    @Body()
    params: {
      fid: number;
      reminder: boolean;
      type: MessageType;
      content;
    },
    @Req() req: Request,
  ): Promise<any> {
    const { id } = req.user;
    return this.messageService.create(id, params);
  }
  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  query(
    @Req() req: Request,
    @Query('fid') fid: number,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
  ) {
    const { id } = req.user;
    return this.messageService.queryMessage(id, fid, {
      page: page,
      pageSize: pageSize,
    });
  }
}
