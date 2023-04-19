import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { CreateGroupDto } from './dtos/create-group.dto';

@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  create(
    @Body() createGroupDto: CreateGroupDto,
    @Req() req: Request,
  ): Promise<any> {
    const { id } = req.user;
    return this.groupService.create(id, createGroupDto);
  }
}
