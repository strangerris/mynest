import { Allow, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Exclude } from 'class-transformer';

export class CreateRoleDto {
  @IsNotEmpty({ message: '角色编码不能为空' })
  code: string;

  @IsNotEmpty({ message: '角色名不能为空' })
  name: string;

  @IsOptional()
  @IsArray()
  permissionIds: number[];

  @IsBoolean()
  @IsOptional()
  enable?: boolean;
}

export class GetRolesDto {
  @IsOptional()
  enable?: boolean;
}

export class UpdateRoleDto {
  @Exclude()
  code: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  @IsArray()
  permissionIds?: number[];

  @IsBoolean()
  @IsOptional()
  enable?: boolean;
}

export class AddRolePermissionsDto {
  @IsNumber()
  id: number;

  @IsArray()
  permissionIds: number[];
}

export class AddRoleUsersDto {
  @IsArray()
  userIds: number[];
}

export class AddRoleButtonsDto {
  @IsNumber()
  id: number;

  @IsNumber()
  menuId: number;

  @IsArray()
  buttons: string[];
}

export class QueryRoleDto {
  @Allow()
  pageSize?: number;

  @Allow()
  pageNo?: number;

  @Allow()
  name?: string;

  @Allow()
  enable?: boolean;
}
