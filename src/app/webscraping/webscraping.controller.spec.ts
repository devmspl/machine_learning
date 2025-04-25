import { Test, TestingModule } from '@nestjs/testing';
import { WebscrapingController } from './webscraping.controller';

describe('WebscrapingController', () => {
  let controller: WebscrapingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebscrapingController],
    }).compile();

    controller = module.get<WebscrapingController>(WebscrapingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
