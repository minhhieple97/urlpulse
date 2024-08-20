import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { UrlService } from './url.service';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UrlService', () => {
  let service: UrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlService],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getReachableUrlsOrderedByPriority', () => {
    it('should return reachable URLs ordered by priority', async () => {
      mockedAxios.get.mockImplementation((url) => {
        if (url === 'https://gitlab.com' || url === 'http://app.scnt.me') {
          return Promise.resolve({ status: 200 });
        }
        return Promise.reject(new Error('Not reachable'));
      });

      const result = await service.getReachableUrlsOrderedByPriority();
      expect(result).toEqual([
        { url: 'http://app.scnt.me', priority: 3 },
        { url: 'https://gitlab.com', priority: 4 },
      ]);
    });

    it('should return an empty array when no URLs are reachable', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Not reachable'));

      const result = await service.getReachableUrlsOrderedByPriority();
      expect(result).toEqual([]);
    });

    it('should correctly order URLs with the same priority', async () => {
      mockedAxios.get.mockImplementation((url) => {
        if (url === 'https://gitlab.com' || url === 'https://github.com') {
          return Promise.resolve({ status: 200 });
        }
        return Promise.reject(new Error('Not reachable'));
      });

      const result = await service.getReachableUrlsOrderedByPriority();
      expect(result).toEqual([
        { url: 'https://gitlab.com', priority: 4 },
        { url: 'https://github.com', priority: 4 },
      ]);
    });

    it('should handle URLs with different status codes', async () => {
      mockedAxios.get.mockImplementation((url) => {
        switch (url) {
          case 'https://gitlab.com':
            return Promise.resolve({ status: 200 });
          case 'http://app.scnt.me':
            return Promise.resolve({ status: 299 });
          case 'https://github.com':
            return Promise.resolve({ status: 300 });
          default:
            return Promise.reject(new Error('Request failed'));
        }
      });

      const result = await service.getReachableUrlsOrderedByPriority();
      expect(result).toEqual([
        { url: 'http://app.scnt.me', priority: 3 },
        { url: 'https://gitlab.com', priority: 4 },
      ]);
    });
  });

  describe('getReachableUrlsByPriority', () => {
    it('should return reachable URLs for a given priority', async () => {
      mockedAxios.get.mockImplementation((url) => {
        if (url === 'https://gitlab.com') {
          return Promise.resolve({ status: 200 });
        }
        return Promise.reject(new Error('Not reachable'));
      });

      const result = await service.getReachableUrlsByPriority(4);
      expect(result).toEqual([{ url: 'https://gitlab.com', priority: 4 }]);
    });
    it('should return empty array when priority is not found', async () => {
      const result = await service.getReachableUrlsByPriority(10);
      expect(result).toEqual([]);
    });
  });

  describe('Error handling', () => {
    it('should handle network errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      const result = await service.getReachableUrlsOrderedByPriority();
      expect(result).toEqual([]);
    });

    it('should handle timeout errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Timeout'));

      const result = await service.getReachableUrlsOrderedByPriority();
      expect(result).toEqual([]);
    });
  });
});
