import { Test } from '@nestjs/testing';
import { JobService } from './job.service';
import { JobRepository } from './job.repository';
import { NotFoundException } from '@nestjs/common';
import { ApplicationRepository } from '../application/application.repository';


describe('JobService - findJobById', () => {
  let service: JobService;
  let repo: JobRepository;


  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JobService,
        {
          provide: JobRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: ApplicationRepository,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get(JobService);
    repo = module.get(JobRepository);
  });

  it('should return the job if found', async () => {
    const mockJob = { _id: 'job123', title: 'Dev NestJS' };
    jest.spyOn(repo, 'findById').mockResolvedValue(mockJob as any);

    const result = await service.findJobById('job123');
    expect(result).toEqual(mockJob);
  });

  it('should throw NotFoundException if job not found', async () => {
    jest.spyOn(repo, 'findById').mockResolvedValue(null);

    await expect(service.findJobById('unknown')).rejects.toThrow(
      NotFoundException,
    );
  });
});
