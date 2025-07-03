import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param, Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JobService } from './job.service';
import { CreateJobDto, UpdateJobDto } from './job.dto';
import { Job } from './job.schema';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('jobs')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.RECRUTEUR)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiOperation({ summary: 'Créer une offre' })
  @ApiBody({ type: () => CreateJobDto })
  async create(
    @CurrentUser('sub') recruiterId: string,
    @Body() job: CreateJobDto
  ): Promise<Job> {
    return await this.jobService.createJob(job, recruiterId);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({ summary: 'Liste des offres' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async allJob(@Query('page') page = 1, @Query('limit') limit = 10) {
    return await this.jobService.jobList(Number(page), Number(limit));
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOperation({ summary: "Détail d'une offre" })
  async getJob(@Param('id') id: string) {
    return this.jobService.findJobById(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.RECRUTEUR)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  @ApiOperation({ summary: 'Modifier une offre' })
  @ApiBody({ type: () => UpdateJobDto })
  async updateJob(
    @CurrentUser('sub') recruiterId: string,
    @Param('id') id: string,
    @Body() job: UpdateJobDto) {
    return await this.jobService.updateJob(id, recruiterId, job);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.RECRUTEUR)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une offre' })
  async deleteJob(
    @CurrentUser('sub') recruiterId: string,
    @Param('id') id: string
  ) {
    return await this.jobService.deleteJob(id, recruiterId);
  }


  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.CANDIDAT)
  @HttpCode(HttpStatus.CREATED)
  @Post(':id/apply')
  @ApiOperation({ summary: 'Postuler à une offre' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix =
          Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async applyToJob(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ){
    const filePath = file.path;
    return await this.jobService.applyToJob(id, userId, filePath);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.RECRUTEUR)
  @HttpCode(HttpStatus.OK)
  @Get(':id/applications')
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiOperation({ summary: 'Voir les candidatures reçues' })
  async getApplicationsByJob(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.jobService.applyListJob(id, userId, page, limit);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.RECRUTEUR)
  @HttpCode(HttpStatus.OK)
  @Put(':id/status')
  @ApiOperation({ summary: 'Activer ou désactiver une offre' })
  @ApiParam({ name: 'id', type: String })
  async toggleStatus(
    @Param('id') jobId: string,
    @CurrentUser('sub') recruiterId: string,
  ){
    const job = await this.jobService.JobStatus(jobId, recruiterId);
    const message = job.status ? 'Offre activée' : 'Offre désactivée';
    return { message };
  }


}
