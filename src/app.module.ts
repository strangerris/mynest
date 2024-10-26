import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { createClient } from 'redis'
import { UserModule } from './modules/user/user.module';
import { PermissionModule } from '@/modules/permission/permission.module';
import { RoleModule } from '@/modules/role/role.module';

@Module({
  imports:[
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    UserModule,
    AuthModule,
    SharedModule,
    PermissionModule,
    RoleModule
  ],
})
export class AppModule  {
}