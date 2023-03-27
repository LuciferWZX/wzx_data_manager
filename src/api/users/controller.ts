import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
  @Get()
  findAll(): string {
    return 'This is all user';
  }
}
