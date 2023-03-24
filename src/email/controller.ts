import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { EmailService } from './service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  @HttpCode(200)
  sendEmail() {
    this.emailService.example();
    return 0;
  }

  /**
   * 发送验证码到邮箱
   * @param email
   */
  @Post('/code')
  @HttpCode(200)
  async sendEmailCode(@Body('email') email: string) {
    return this.emailService.sendEmailVerifyCode(email);
  }
}
