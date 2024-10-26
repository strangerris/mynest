import { RedisService } from './redis.service';
import { Global, Module, ValidationPipe } from '@nestjs/common';

@Module({
  providers: [
    RedisService,
  ],
})


export class SharedModule {
}
