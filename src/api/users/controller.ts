import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../../entity/user.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * 新建用户
   * @param createUserDto
   */
  @Post()
  @HttpCode(200)
  create(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.usersService.create(createUserDto);
  }

  /**
   * 修改用户
   * @param id
   * @param updateUserDto
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  @Post('/query')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async query(
    @Body() params: { queryStr: string },
    @Req() req: Request,
  ): Promise<
    Pick<
      User,
      'id' | 'avatar' | 'ban' | 'username' | 'phone' | 'email' | 'sign' | 'dm'
    >[]
  > {
    const { id } = req.user;
    return await this.usersService.queryUsers(id, params.queryStr);
  }
  @Post('/ban')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  ban(@Body() params: { uid: number; reason: string }): Promise<void> {
    return this.usersService.banUser(params.uid, params.reason);
  }
  @Get()
  findAll(): string {
    return 'This is all user';
  }
}
