import { SharedService } from '@/shared/shared.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { In, Repository } from 'typeorm';

export class PermissionService {
  constructor(
    private readonly sharedService: SharedService,
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
  ) {
  }

  async findAllTree() {
    const permissions = await this.permissionRepo.find({
      where: { enable: true },
      order: { order: 'ASC' },
    });
    return this.sharedService.handleTree(permissions);
  }
}