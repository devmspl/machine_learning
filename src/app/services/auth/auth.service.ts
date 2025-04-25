import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { DATABASE_CONNECTION } from '@app/common/infra/mongoose/database.config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name,DATABASE_CONNECTION.WONDRFLY) private readonly userModel: Model<User>,
    private readonly jwt: JwtService,
  ) {}

  async verifyUserWithJwt(token: string) {
    try {
      const decode = this.jwt.verify(token);

      if (!decode.id) {  // new add code
        throw new UnauthorizedException('Invalid token structure');
      }  // new add code

      const jwt_error_list = {
        TokenExpiredError: 'TokenExpiredError',
        JsonWebTokenError: 'JsonWebTokenError',
        NotBeforeError: 'NotBeforeError',
      };  

      if (jwt_error_list[decode.name]) {
        throw jwt_error_list[decode.name];
      }

      const user = await this.userModel.findById(decode.id);  // new add code
      // const user = await this.userModel.findById(decode._id); // old code

      if (!user) {
        throw 'invalid user';
      }

      return [null, user];
    } catch (err) {
      return [err, null];
    }
  }
}
