import { Controller, Get, Query } from '@nestjs/common';
import { UrlService } from './url.service';
import { QueryUrlDto } from './dtos';

@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Get()
  async getReachableUrlsOrderedByPriority() {
    return this.urlService.getReachableUrlsOrderedByPriority();
  }

  @Get('by-priority')
  async getReachableUrlsByPriority(@Query() query: QueryUrlDto) {
    return this.urlService.getReachableUrlsByPriority(query.priority);
  }
}
