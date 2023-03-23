import { Injectable } from '@nestjs/common';
import { RedisService as NRedisService } from 'nestjs-redis';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  public client: Redis;
  constructor(private redisService: NRedisService) {
    this.getClient().then();
  }
  async getClient() {
    this.client = await this.redisService.getClient();
  }

  /**
   * @Description: 封装设置redis缓存的{String} key值方法
   * @param key {String} key值
   * @param value {String} key的值
   * @param seconds {Number} 过期时间 秒秒秒！！！
   */
  public async set(key: string, value: any, seconds?: number) {
    value = JSON.stringify(value);
    if (!this.client) {
      await this.getClient();
    }
    if (!seconds) {
      await this.client.set(key, value);
    } else {
      await this.client.set(key, value, 'EX', seconds);
    }
  }
  //获取值的方法
  public async get(key: string) {
    if (!this.client) {
      await this.getClient();
    }
    const data = await this.client.get(key);
    if (!data) return;
    return JSON.parse(data);
  }

  //获取值的方法
  public async del(key: string) {
    if (!this.client) {
      await this.getClient();
    }
    await this.client.del(key);
  }
  // 清理缓存
  public async flushall(): Promise<any> {
    if (!this.client) {
      await this.getClient();
    }

    await this.client.flushall();
  }
}
