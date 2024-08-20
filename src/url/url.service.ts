import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { URL_LIST } from '../config/url-list.config';
import { Url } from './interfaces';

@Injectable()
export class UrlService {
  private readonly timeout = 5000;

  async getReachableUrlsOrderedByPriority(): Promise<Url[]> {
    const reachableUrls = await this.checkUrlsReachability(URL_LIST);
    return reachableUrls.sort((a, b) => a.priority - b.priority);
  }

  async getReachableUrlsByPriority(priority: number): Promise<Url[]> {
    const urlsWithPriority = URL_LIST.filter(
      (url) => url.priority === priority,
    );
    return this.checkUrlsReachability(urlsWithPriority);
  }

  private async checkUrlsReachability(urls: Url[]): Promise<Url[]> {
    const checkPromises = urls.map((url) => this.isUrlReachable(url));
    const results = await Promise.all(checkPromises);
    return results.filter(Boolean) as Url[];
  }

  private async isUrlReachable(url: Url): Promise<Url | null> {
    try {
      const response = await axios.get(url.url, { timeout: this.timeout });
      return response.status >= 200 && response.status < 300 ? url : null;
    } catch (error) {
      return null;
    }
  }
}
