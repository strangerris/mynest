import {
  AddRolePermissionsDto,
  AddRoleUsersDto,
  CreateRoleDto,
  GetRolesDto,
  QueryRoleDto,
  UpdateRoleDto,
} from './dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { RoleService } from '@/modules/role/role.service';
import { JwtGuard, RoleGuard } from '@/common/guards';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('role')
@UseGuards(JwtGuard,RoleGuard)

export class RoleController {
  constructor(
    private readonly roleService: RoleService
  ) {
  }
  @Post()
  @Roles('SUPER_ADMIN')
  create(@Body() createRoleDto: CreateRoleDto) {

    return this.roleService.create(createRoleDto);
  }
  @Get()
  findAll(@Query() query: GetRolesDto) {
    return this.roleService.findAll(query);
  }
  @Get('permissions/tree')
  findRolePermissionsTree(@Request() req: any) {

    return this.roleService.findRolePermissionsTree(req.user.currentRoleCode);
  }
  @Get('page')
  findPagination(@Query() queryDto: QueryRoleDto) {
    return this.roleService.findPagination(queryDto);
  }

  @Patch(':id')
  // @Roles('SUPER_ADMIN', 'SYS_ADMIN', 'ROLE_PMS')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }
}