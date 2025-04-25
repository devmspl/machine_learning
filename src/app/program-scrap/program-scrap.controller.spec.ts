import { Test, TestingModule } from '@nestjs/testing';
import { ProgramScrapController } from './program-scrap.controller';

describe('ProgramScrapController', () => {
  let controller: ProgramScrapController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgramScrapController],
    }).compile();

    controller = module.get<ProgramScrapController>(ProgramScrapController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
