import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApplicationService } from './application.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('applications')
@ApiBearerAuth()
@Controller('')
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.CANDIDAT)
  @Get('/me/applications')
  @ApiOperation({ summary: 'Voir ses propres candidatures' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async getMyApplications(
    @CurrentUser('sub') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.appService.getMyApplications(userId, page, limit);
  }
}
