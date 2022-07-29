import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('/')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll(): any {
    return this.usersService.getAll();
  }

  @Get('/:name')
  async getByUser(@Param('name') name: string): Promise<any> {
    return this.usersService.getByUser(name);
  }

  @Post()
  async createUser(@Body() body): Promise<any> {
    const { name, message } = body;
    return await this.usersService.create(name, message);
  }
}
