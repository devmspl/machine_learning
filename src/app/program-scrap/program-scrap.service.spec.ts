import { Test, TestingModule } from '@nestjs/testing';
import { ProgramScrapService } from './program-scrap.service';

describe('ProgramScrapService', () => {
  let service: ProgramScrapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgramScrapService],
    }).compile();

    service = module.get<ProgramScrapService>(ProgramScrapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
