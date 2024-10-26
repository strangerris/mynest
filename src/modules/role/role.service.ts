import { SharedService } from '@/shared/shared.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Permission } from '@/modules/permission/permission.entity';
import { In, Like, Repository } from 'typeorm';
import { User } from '@/modules/user/user.entity';
import {
  AddRolePermissionsDto,
  AddRoleUsersDto,
  CreateRoleDto,
  GetRolesDto,
  QueryRoleDto,
  UpdateRoleDto,
} from './dto';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class RoleService {
  constructor(
    private readonly sharedService: SharedService,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
    @InjectRepository(User) private userRepo: Repository<User>) {
  }

  async create(createRoleDto: CreateRoleDto) {
    const existRole = await this.roleRepo.findOne({
      where: [{ name: createRoleDto.name }, { code: createRoleDto.code }],
    });
    if (existRole) throw new BadRequestException('角色已存在（角色名和角色编码不能重复）');
    const role = this.roleRepo.create(createRoleDto);
    console.log(createRoleDto, createRoleDto.permissionIds);

    if (createRoleDto.permissionIds) {
      role.permissions = await this.permissionRepo.find({
        where: { id: In(createRoleDto.permissionIds) },
      });
    }
    return this.roleRepo.save(role);
  }

  async findRolePermissionsTree(code: string) {
    const role = await this.roleRepo.findOne({
      where: { code },

    });
    if (!role) throw new BadRequestException('当前角色不存在或者已删除');
    const permissions = await this.permissionRepo.find({
      where: { roles: [role], enable: true },
    });
    return this.sharedService.handleTree(permissions);
  }

  async findPagination(query: QueryRoleDto) {
    const pageSize = query.pageSize || 10;
    const pageNo = query.pageNo || 1;
    const [data, total] = await this.roleRepo.findAndCount({
      where: {
        name: Like(`%${query.name || ''}%`),
        enable: query.enable || undefined,
      },
      relations: { permissions: true },
      order: {
        name: 'DESC',
      },
      take: pageSize,
      skip: (pageNo - 1) * pageSize,
    });
    const pageData = data.map((item) => {
      const permissionIds = item.permissions.map((p) => p.id);
      delete item.permissions;
      return { ...item, permissionIds };
    });
    return { pageData, total };
  }

  async findOne(id: number) {
    return this.roleRepo.findOne({ where: { id } });
  }

  async findAll(query: GetRolesDto) {
    return this.roleRepo.find({ where: query });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    if (!role) throw new BadRequestException('角色不存在或者已删除');
    if (role.code === 'SUPER_ADMIN') throw new BadRequestException('不允许修改超级管理员');
    const newRole = this.roleRepo.merge(role, updateRoleDto);
    if (updateRoleDto.permissionIds) {
      newRole.permissions = await this.permissionRepo.find({
        where: { id: In(updateRoleDto.permissionIds) },
      });
    }
    await this.roleRepo.save(newRole);
    return true;
  }
}