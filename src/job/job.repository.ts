import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Job, JobDocument } from './job.schema';
import { CreateJobDto, UpdateJobDto } from './job.dto';

@Injectable()
export class JobRepository {
  constructor(
    @InjectModel(Job.name)
    private readonly model: Model<JobDocument>,
  ) {}

  async create(data: CreateJobDto, recruiterId: string) {
    return this.model.create({
      ...data,
      recruiter: new Types.ObjectId(recruiterId),
    });
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model.find().skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
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

  async findById(id: string) {
    return await this.model.findById(id).exec();
  }

  async update(id: string, recruiterId: string, data: Partial<UpdateJobDto>) {
    return await this.model
      .findOneAndUpdate({ _id: id, recruiter: recruiterId }, data, {
        new: true,
      }).exec();
  }

  async delete(id: string, recruiterId: string) {
    return await this.model
      .findOneAndDelete({ _id: id, recruiter: recruiterId }).exec();
  }
}
