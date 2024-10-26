import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Profile } from './profile.entity';
import { Role } from '@/modules/role/role.entity';
import { JwtStrategy } from '@/modules/auth/jwt.strategy';
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Role])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}