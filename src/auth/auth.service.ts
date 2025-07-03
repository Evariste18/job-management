import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async register(data: CreateUserDto) {
    const user = await this.userService.findByEmail(data.email);
    if (user) throw new ConflictException('Cet Email existe déjà');
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await this.userService.create({ ...data, password: hashedPassword });
  }

  async authenticate(data: LoginDto) {
    const user = await this.userService.findByEmail(data.email);
    if (!user) throw new UnauthorizedException('Email ou mot de passe invalide');
    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) throw new UnauthorizedException('Email ou mot de passe invalide');
    const payload = { sub: user._id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
