import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { JobRepository } from './job.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './job.schema';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/auth.guard';
import { ConfigModule } from '@nestjs/config';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
    JwtModule,
    ConfigModule,
    ApplicationModule
  ],
  providers: [JobService, JobRepository, AuthGuard],
  controllers: [JobController],
})
export class JobModule {}
