import { CustomException } from '@/common/exceptions/custom.exception';
import { ErrorCode } from '@/common/exceptions/custom.exception';
import { ACCESS_TOKEN_EXPIRATION_TIME, USER_ACCESS_TOKEN_KEY } from '@/constants/redis.contant';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@/shared/redis.service';
import { Injectable } from '@nestjs/common';
import { UserService} from '@/modules/user/user.service';
import { compareSync } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
    private userService: UserService,
  ) {}

  login(user: any) {
    // 判断用户是否有enable属性为true的角色
    if (!user?.roles?.some((item) => item.enable)) {
      throw new CustomException(ErrorCode.ERR_11003);
    }
    const roleCodes = user.roles?.map(item => item.code);
    const currentRole = user.roles[0];
    const payload = {
      userId: user.id,
      username: user.username,
      roleCodes,
      currentRoleCode: currentRole.code,
    };
    return this.generateToken(payload);
  }

  generateToken(payload: any) {
    const accessToken = this.jwtService.sign(payload);
    this.redisService.set(
      this.getAccessTokenKey(payload),
      accessToken,
      ACCESS_TOKEN_EXPIRATION_TIME,
    );
    return {
      accessToken,
    };
  }

  getAccessTokenKey(payload: any) {
    return `${USER_ACCESS_TOKEN_KEY}:${payload.userId}${
      payload.captcha ? ':' + payload.captcha : ''
    }`;
  }

  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (user && compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async logout(user: any) {
    if (user.userId) {
      await Promise.all([this.redisService.del(this.getAccessTokenKey(user))]);
      return true;
    }
    return false;
  }

}