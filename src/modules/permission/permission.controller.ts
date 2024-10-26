import { Controller, Get, Injectable } from '@nestjs/common';
import { PermissionService} from '@/modules/permission/permission.service';

@Controller('permission')
export class PermissionController {
  constructor(
    private readonly permissionService: PermissionService
  ) {
  }

  @Get('tree')
  findAllTree() {
    return this.permissionService.findAllTree();
  }
}