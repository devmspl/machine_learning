import { Test, TestingModule } from '@nestjs/testing';
import { ScriptLogsController } from './script-logs.controller';

describe('ScriptLogsController', () => {
  let controller: ScriptLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScriptLogsController],
    }).compile();

    controller = module.get<ScriptLogsController>(ScriptLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
