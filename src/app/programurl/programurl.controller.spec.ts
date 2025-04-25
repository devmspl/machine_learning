import { Test, TestingModule } from '@nestjs/testing';
import { ProgramurlController } from './programurl.controller';

describe('ProgramurlController', () => {
  let controller: ProgramurlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgramurlController],
    }).compile();

    controller = module.get<ProgramurlController>(ProgramurlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
