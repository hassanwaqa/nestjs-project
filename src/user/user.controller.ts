import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('add-user')
  addUser(@Body() dto: UserDto) {
    return this.userService.addUser(dto);
  }

  @Get('get-users')
  getUsers() {
    return this.userService.getUsers();
  }

  @Get('get-adults')
  async getUsersOver18() {
    return this.userService.getUsersOver18();
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }
}
