import { Test, TestingModule } from '@nestjs/testing';
import { WebsiteStructureController } from './website_structure.controller';

describe('WebsiteStructureController', () => {
  let controller: WebsiteStructureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebsiteStructureController],
    }).compile();

    controller = module.get<WebsiteStructureController>(WebsiteStructureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
