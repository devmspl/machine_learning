import { Test, TestingModule } from '@nestjs/testing';
import { ScriptLogsService } from './script-logs.service';

describe('ScriptLogsService', () => {
  let service: ScriptLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScriptLogsService],
    }).compile();

    service = module.get<ScriptLogsService>(ScriptLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
