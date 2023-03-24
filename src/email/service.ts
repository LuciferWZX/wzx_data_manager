import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { getVerifyCode } from '../utils/dm_number';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class EmailService {
  private EXP_TIME = 1 * 60 * 5;
  constructor(
    private readonly mailerService: MailerService,
    private readonly redisService: RedisService,
  ) {}

  //测试邮箱是否发送成功
  example() {
    Logger.log('发送邮箱之前');
    this.mailerService
      .sendMail({
        to: '1262796090@qq.com',
        from: '2396423791@qq.com',
        subject: '主题是测试邮箱发送',
        text: '这个我也不知道是啥',
        html: '<b>你的验证码是 00000</b>',
      })
      .then()
      .catch((reason) => {
        console.log('邮箱发送出错:', reason);
        throw new HttpException('邮箱发送发生异常', HttpStatus.BAD_REQUEST);
      });
    Logger.log('发送邮箱之后');
  }

  /**
   * 发送验证码到邮箱
   * @param email
   */
  async sendEmailVerifyCode(email: string) {
    const code = getVerifyCode();
    const cacheCode = await this.redisService.get(email);
    if (cacheCode) {
      console.log('验证码从缓存获取：', cacheCode);
      //将过期时间重置
      await this.redisService.set(email, code, this.EXP_TIME);
      return 'OK';
    }
    try {
      await this.mailerService.sendMail({
        to: email, // list of receivers
        // from: '1731822242@qq.com', // sender address 已经写在环境变量里面，从里面获取
        subject: 'wzx_data_manager系统验证码', // Subject line
        html: `您的验证码为：<b>${code}</b>,请在5分钟内使用`,
      });
      await this.redisService.set(email, code, this.EXP_TIME);
    } catch (e) {
      console.log('邮箱发送出错:', e);
      throw new HttpException('邮箱发送发生异常', HttpStatus.BAD_REQUEST);
    }
    return 'OK';
  }
}
