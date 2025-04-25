import { Test, TestingModule } from '@nestjs/testing';
import { ProgramurlService } from './programurl.service';

describe('ProgramurlService', () => {
  let service: ProgramurlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgramurlService],
    }).compile();

    service = module.get<ProgramurlService>(ProgramurlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
