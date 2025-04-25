import { Test, TestingModule } from '@nestjs/testing';
import { WebsiteStructureService } from './website_structure.service';

describe('WebsiteStructureService', () => {
  let service: WebsiteStructureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebsiteStructureService],
    }).compile();

    service = module.get<WebsiteStructureService>(WebsiteStructureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
