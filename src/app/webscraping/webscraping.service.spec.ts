import { Test, TestingModule } from '@nestjs/testing';
import { WebscrapingService } from './webscraping.service';

describe('WebscrapingService', () => {
  let service: WebscrapingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebscrapingService],
    }).compile();

    service = module.get<WebscrapingService>(WebscrapingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
