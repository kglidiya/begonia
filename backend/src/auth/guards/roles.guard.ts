import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '../roles/roles.decorator';
import { ExtractJwt } from 'passport-jwt';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {
    ({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET
    });
  }

  canActivate(context: ExecutionContext): boolean {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()]
      );
   
      if (!requiredRoles) {
        return true;
      }
  
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];
      // console.log(authHeader.split(' ')[0])
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован'
        });
      }

      const user = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET
      });
      // console.log(requiredRoles.some((role) => user.role.includes(role)))
      // console.log(user)
      return requiredRoles.some((role) => user.role.includes(role));
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException({
        message: 'No access'
      });
    }
  }
}
