import { RedisService } from './redis.service';
import { Global, Module, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/user/user.entity';
import { Profile } from '@/modules/user/profile.entity';
import { Role } from '@/modules/role/role.entity';
import { Permission } from '@/modules/permission/permission.entity';
import { SharedService } from '@/shared/shared.service'

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          autoLoadEntities: true,
          host: process.env.DB_HOST || configService.get('DB_HOST'),
          port: +process.env.DB_PORT || configService.get('DB_PORT'),
          username: process.env.DB_USER || configService.get('DB_USER'),
          password: process.env.DB_PWD || configService.get('DB_PWD'),
          database: process.env.DB_DATABASE || configService.get('DB_DATABASE'),
          synchronize: process.env.NODE_ENV === 'production' ? false : configService.get('DB_SYNC'),
          timezone: '+08:00',
          entities: [
            User,
            Profile,
            Role,
            Permission,
          ],
        };
      },
    }),
  ],
  providers: [
    RedisService,
    SharedService,
    {
      inject: [ConfigService],
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const client = createClient({
          url: configService.get('REDIS_URL'),
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [SharedService, RedisService],
})

export class SharedModule {
}
