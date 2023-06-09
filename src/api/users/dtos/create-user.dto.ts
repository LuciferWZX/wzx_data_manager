export class CreateUserDto {
  type: 'email' | 'phone';
  email: string;
  phone: string;
  phonePrefix: string;
  verifyCode: string; //长度6位数字
  username: string;
  nickname: string;
  password: string;
}
