import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      let msg = 'token已过期';
      if (info.message === 'No auth token') {
        msg = 'token不存在';
      }
      throw err || new UnauthorizedException(msg);
    }
    return user;
  }
}
