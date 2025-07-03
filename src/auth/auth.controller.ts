import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody, ApiCreatedResponse,
  ApiOperation,
  ApiTags, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/user.dto';
import { LoginDto } from './dto/auth.dto';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() user: CreateUserDto) {
    return await this.authService.register(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Authentiication' })
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({
    description: 'Connexion réussie',
    schema: {
      example: {
        access_token: 'string',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Requête invalide',
    schema: {
      example: {
        statusCode: 400,
        timestamp: 'string',
        path: '/auth/login',
        message: ['string'],
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Email ou mot de passe incorrect',
    schema: {
      example: {
        statusCode: 401,
        timestamp: 'string',
        path: '/auth/login',
        message: 'Email ou mot de passe invalide',
      },
    },
  })
  async login(@Body() data: LoginDto) {
    return await this.authService.authenticate(data);
  }
}
