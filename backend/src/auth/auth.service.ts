import { LoginDto, RegisterDto } from './dto';
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from './../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(signInDto.email);
    if (!user) throw new NotFoundException();
    const isMatch = await bcrypt.compare(signInDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user._id, email: user.email, name: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(signUpDto: RegisterDto): Promise<any> {
    const user = await this.usersService.findOne(signUpDto.email);
    if (user) throw new ConflictException();
    const hash = await bcrypt.hash(signUpDto.password, 10);
    const registeredUser = await this.usersService.register({
      ...signUpDto,
      password: hash,
    });
    if (registeredUser) {
      const payload = {
        sub: registeredUser._id,
        email: registeredUser.email,
        name: registeredUser.name,
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
    throw new InternalServerErrorException();
  }
}
