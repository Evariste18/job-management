import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JobRepository } from './job.repository';
import { CreateJobDto, UpdateJobDto } from './job.dto';
import { ApplicationRepository } from '../application/application.repository';

@Injectable()
export class JobService {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly appRepository: ApplicationRepository,
  ) {}

  async createJob(data: CreateJobDto, recruiterId: string) {
    return await this.jobRepository.create(data, recruiterId);
  }

  async jobList(page: number, limit: number) {
    return await this.jobRepository.findAll(page, limit);
  }

  async findJobById(id: string) {
    const job = await this.jobRepository.findById(id);
    if (!job) throw new NotFoundException('Offre non trouvée');
    return job;
  }

  async updateJob(id: string, recruiterId: string, data: UpdateJobDto) {
    const job = await this.jobRepository.findById(id);
    if (!job) throw new NotFoundException('Offre non trouvée');
    if (job.recruiter.toString() !== recruiterId)
      throw new ForbiddenException('Non autorisé à modifier cette offre');
    return await this.jobRepository.update(id, recruiterId, data);
  }

  async deleteJob(id: string, recruiterId: string) {
    const job = await this.jobRepository.findById(id);
    if (!job) throw new NotFoundException('Offre non trouvée');
    if (job.recruiter.toString() !== recruiterId)
      throw new ForbiddenException('Non autorisé à supprimer cette offre');
    return await this.jobRepository.delete(id, recruiterId);
  }

  async applyToJob(id: string, candidateId: string, filePath: string) {
    return await this.appRepository.create(id, candidateId, filePath);
  }

  async applyListJob(
    id: string,
    recruiterId: string,
    page: number,
    limit: number,
  ) {
    const job = await this.jobRepository.findById(id);
    if (!job) throw new NotFoundException('Offre non trouvée');
    if (job.recruiter.toString() !== recruiterId)
      throw new ForbiddenException('Non autorisé à voir cette liste');

    return await this.appRepository.applyListByJob(id, page, limit);
  }

  async JobStatus(jobId: string, recruiterId: string) {
    const job = await this.jobRepository.findById(jobId);
    if (!job) throw new NotFoundException('Offre non trouvée');
    if (job.recruiter.toString() !== recruiterId)
      throw new ForbiddenException(
        'Non autorisé désactiver/activer cette offre',
      );

    job.status = !job.status;
    return job.save();
  }
}
