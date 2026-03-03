import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { env } from 'src/config/env';
import { ExtractJwt } from 'passport-jwt';
import { RedisService } from 'src/redis/redis.service';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private redisService: RedisService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.JWT_ACCESS_SECRET,
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: { sub: string; email: string }) {
    const accessToken = req.headers['authorization'].split(' ')[1];
    if (!accessToken) {
      throw new UnauthorizedException('Invalid token');
    }
    const isBlacklisted = await this.redisService.getValue(
      `blacklist:${accessToken}`,
    );
    if (isBlacklisted) {
      throw new UnauthorizedException('Invalid token');
    }

    return { id: payload.sub, email: payload.email, accessToken };
  }
}
