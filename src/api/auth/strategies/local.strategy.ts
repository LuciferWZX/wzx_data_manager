import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../service';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'way',
      passwordField: 'value',
    });
  }
  async validate(way: 'username' | 'email' | 'phone' | 'dm', value: string) {
    return this.authService.validateUser(way, value);
  }
}
