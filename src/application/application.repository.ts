import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Application, ApplicationDocument } from './application.schema';

@Injectable()
export class ApplicationRepository {
  constructor(
    @InjectModel(Application.name)
    private readonly model: Model<ApplicationDocument>,
  ) {}

  async create(jobId: string, candidateId: string, cvUrl: string) {
    return this.model.create({
      cvUrl: cvUrl,
      job: new Types.ObjectId(jobId),
      candidate: new Types.ObjectId(candidateId),
    });
  }

  async applyListByJob(
    jobId: string,
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model
        .find({ job: jobId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.model.countDocuments(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByUser(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model
        .find({ candidate: userId })
        .populate('job')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.model.countDocuments(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
