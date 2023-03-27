export class LoginUserDto {
  type: 'password' | 'verifyCode';
  way: string;
  phone: string;
  value: string;
  verifyCode: string;
  failedCount: number;
}
