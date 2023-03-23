import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post()
  @HttpCode(200)
  create(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.usersService.create(createUserDto);
  }
  @Get()
  findAll(): string {
    return 'This is all user';
  }
}
