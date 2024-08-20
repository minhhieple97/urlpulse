import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { QueryUrlDto } from './dtos';

describe('UrlController', () => {
  let controller: UrlController;
  let urlService: UrlService;

  beforeEach(async () => {
    const mockUrlService = {
      getReachableUrlsOrderedByPriority: jest.fn(),
      getReachableUrlsByPriority: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: mockUrlService,
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    urlService = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getReachableUrlsOrderedByPriority', () => {
    it('should return reachable URLs ordered by priority', async () => {
      const expectedResult = [
        { url: 'http://example1.com', priority: 1 },
        { url: 'http://example2.com', priority: 2 },
      ];
      jest
        .spyOn(urlService, 'getReachableUrlsOrderedByPriority')
        .mockResolvedValue(expectedResult);

      const result = await controller.getReachableUrlsOrderedByPriority();
      expect(result).toBe(expectedResult);
      expect(urlService.getReachableUrlsOrderedByPriority).toHaveBeenCalled();
    });

    it('should handle empty result', async () => {
      jest
        .spyOn(urlService, 'getReachableUrlsOrderedByPriority')
        .mockResolvedValue([]);

      const result = await controller.getReachableUrlsOrderedByPriority();
      expect(result).toEqual([]);
      expect(urlService.getReachableUrlsOrderedByPriority).toHaveBeenCalled();
    });
  });

  describe('getReachableUrlsByPriority', () => {
    it('should return reachable URLs for a given priority', async () => {
      const query: QueryUrlDto = { priority: 2 };
      const expectedResult = [
        { url: 'http://example1.com', priority: 2 },
        { url: 'http://example2.com', priority: 2 },
      ];
      jest
        .spyOn(urlService, 'getReachableUrlsByPriority')
        .mockResolvedValue(expectedResult);

      const result = await controller.getReachableUrlsByPriority(query);
      expect(result).toBe(expectedResult);
      expect(urlService.getReachableUrlsByPriority).toHaveBeenCalledWith(
        query.priority,
      );
    });

    it('should handle empty result for a given priority', async () => {
      const query: QueryUrlDto = { priority: 3 };
      jest
        .spyOn(urlService, 'getReachableUrlsByPriority')
        .mockResolvedValue([]);

      const result = await controller.getReachableUrlsByPriority(query);
      expect(result).toEqual([]);
      expect(urlService.getReachableUrlsByPriority).toHaveBeenCalledWith(
        query.priority,
      );
    });
  });
});
