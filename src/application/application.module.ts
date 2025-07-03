import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Application, ApplicationSchema } from './application.schema';
import { ApplicationRepository } from './application.repository';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
    ]),
    JwtModule,
    ConfigModule,
  ],
  controllers: [ApplicationController],
  providers: [ApplicationRepository, ApplicationService],
  exports: [ApplicationRepository, MongooseModule],
})
export class ApplicationModule {}
