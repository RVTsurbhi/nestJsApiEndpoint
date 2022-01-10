import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-creds.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(authCreds: AuthCredentialsDto): Promise<any> {
    const { email, username, password } = authCreds;

    const salt = await bcrypt.genSalt();
    const hashPswrd = await bcrypt.hash(password, salt);

    const userData = this.create({ email, username, password: hashPswrd });
    // await this.save(userData);
    // return userData;
    try {
      await this.save(userData);
      return userData;
    } catch (error) {
      console.log('err', error.detail);
      if (error.code === '23505' && error.detail.includes('username')) {
        throw new ConflictException('Username already exists');
      }
      if (error.code === '23505' && error.detail.includes('(email)')) {
        throw new ConflictException('email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
