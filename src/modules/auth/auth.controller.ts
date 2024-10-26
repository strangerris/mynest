import { Body, Controller, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto';
import { Post, Get } from '@nestjs/common';
import { CustomException } from '@/common/exceptions/custom.exception';
import { ErrorCode } from '@/common/exceptions/custom.exception';
import * as svgCaptcha from 'svg-captcha';
import { LocalGuard, JwtGuard, RoleGuard } from '@/common/guards';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@/modules/user/user.service';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('auth')

export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
    private configService: ConfigService,
  ) {
  }

  @UseGuards(LocalGuard)

  @Post('login')
  // 登录验证
  login(@Req() req: any, @Body() body) {
    return this.authService.login(req.user);
  }

  @Post('register')
  resister(@Body() user: RegisterUserDto) {
    return this.userService.create(user);
  }

  @Get('refresh/token')
  @UseGuards(JwtGuard)
  refreshToken(@Req() req: any) {
    return this.authService.generateToken(req.user);
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  async logout(@Req() req: any) {
    return this.authService.logout(req.user);
  }
  //
  // @Post('password')
  // @UseGuards(JwtGuard, PreviewGuard)
  // async changePassword(@Req() req: any, @Body() body: ChangePasswordDto) {
  //   const ret = await this.authService.validateUser(req.user.username, body.oldPassword);
  //   if (!ret) {
  //     throw new CustomException(ErrorCode.ERR_10004);
  //   }
  //   // 修改密码
  //   await this.userService.resetPassword(req.user.id, body.newPassword);
  //   // 修改密码后退出登录
  //   await this.authService.logout(req.user);
  //   return true;
  // }

  @Get('captcha')
  createCaptcha(@Req() req, @Res() res) {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 40,
      width: 80,
      height: 40,
      background: '#fff',
      color: true,
    });
    req.session = {};
    req.session.code = captcha.text || '';
    // res.type('image/svg+xml');
    res.send(captcha.data);
  }
}