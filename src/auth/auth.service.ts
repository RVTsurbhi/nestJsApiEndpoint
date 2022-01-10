import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-creds.dto';
import { UserRepository } from './users.repository';
import * as bycrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private usersRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCreds: AuthCredentialsDto): Promise<any> {
    return this.usersRepository.createUser(authCreds);
  }

  async signIn(
    authCreds: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCreds;
    const userData = await this.usersRepository.findOne({ username });
    if (userData) {
      const decryptPswrd = await bycrypt.compare(password, userData.password);
      if (!decryptPswrd) {
        throw new UnauthorizedException('Invalid creds');
      }
      const payload: JwtPayload = {
        id: userData.id,
        username,
        email: userData.email,
      };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Invalid creds');
    }
  }
}
