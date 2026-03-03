import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { env } from 'src/config/env';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: { sub: string; email: string }) {
    const refreshToken = req.headers['authorization'].split(' ')[1];
    return { id: payload.sub, email: payload.email, refreshToken };
  }
}
