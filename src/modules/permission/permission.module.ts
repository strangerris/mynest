import { Module } from '@nestjs/common';
import { PermissionService } from '@/modules/permission/permission.service';
import { PermissionController } from '@/modules/permission/permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  controllers: [PermissionController],
  providers:[PermissionService]
})
export class PermissionModule {

}