import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../user/services/user.repository';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../../user/entities/user';
import { AuthenticationRequest } from '../controllers/models/auth.request';
import { AuthenticationResponse } from '../controllers/models/auth.response';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthUserService {
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async createToken(
    request: AuthenticationRequest,
  ): Promise<AuthenticationResponse> {
    try {
      const user = await this.userRepository.validateEmailAndPasswordAsync(
        request.email,
        request.password,
      );

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = await this.jwtService.signAsync(user);

      const result = new AuthenticationResponse();
      result.userId = user.id;
      result.email = user.email;
      result.token = token;
      result.expiresIn =
        60 *
        60 *
        24 *
        parseInt(this.configService.get<string>('app.jwt.expirationDays'));

      return result;
    } catch (error) {
      throw error;
    }
  }

  async verifyToken(token: string): Promise<UserModel> {
    return await this.jwtService.verifyAsync(token);
  }
}
