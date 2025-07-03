import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('User')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
