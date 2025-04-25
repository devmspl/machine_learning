import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<any | Observable<boolean>> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-access-token'];
    if (!token) {
      throw new HttpException('token is required', HttpStatus.BAD_GATEWAY);
    }

    const [err, verified_user] = await this.authService.verifyUserWithJwt(
      token,
    );

    if (err) {
      throw new HttpException(err, HttpStatus.UNAUTHORIZED);
    }

    if (!verified_user) {
      return false;
    }

    request['user'] = verified_user;
    return true;
  }
}
