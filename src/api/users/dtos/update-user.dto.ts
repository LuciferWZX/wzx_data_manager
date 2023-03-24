export class UpdateUserDto {
  email: string;
  phone: string;
  phonePrefix: string;
  verifyCode: string; //长度6位数字
  username: string;
  nickname: string;
  password: string;
  firstName: string;
  lastName: string;
}
