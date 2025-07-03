import { Injectable } from '@nestjs/common';
import { ApplicationRepository } from './application.repository';

@Injectable()
export class ApplicationService {
  constructor(private readonly appRepository: ApplicationRepository) {}

  async getMyApplications(candidateId: string, page: number, limit: number) {
    return await this.appRepository.findByUser(candidateId, page, limit);
  }
}
