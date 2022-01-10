import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-creds.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCreds: AuthCredentialsDto): Promise<any> {
    return this.authservice.signUp(authCreds);
  }

  @Post('/signIn')
  signIn(
    @Body() authCreds: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authservice.signIn(authCreds);
  }
}
