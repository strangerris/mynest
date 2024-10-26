import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Query,
  Delete,
  Patch,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { JwtGuard } from '@/common/guards';
import {
  AddUserRolesDto,
  CreateUserDto,
  GetUserDto,
  UpdatePasswordDto,
  UpdateProfileDto,
  UpdateUserDto,
} from './dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {
  }

  @Post()
  // @Roles('SUPER_ADMIN')
  addUser(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  @Get()
  getAllUsers(@Query() queryDto: GetUserDto) {
    return this.userService.findAll(queryDto);
  }
  @Delete(':id')
  // @Roles('SUPER_ADMIN')
  deleteUser(@Param('id') id: number, @Request() req: any) {
    const currentUser = req.user;

    // if (currentUser.userId === id)
    //   throw new CustomException(ErrorCode.ERR_11006, '非法操作，不能删除自己！');
    return this.userService.remove(id);
  }
  @UseGuards(JwtGuard)
  @Get('detail')
  getUserInfo(@Request() req: any) {
    const currentUser = req.user;
    return this.userService.findUserDetail(currentUser.userId, currentUser.currentRoleCode);
  }
}