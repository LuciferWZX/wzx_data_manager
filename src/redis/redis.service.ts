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

  /**
   * bitmap是一种位图数据结构，只有0/1，很多场景可以用这一数据结构来省空间
   * 使用场景
   * 已读判断
   * 签到判断
   * 统计在线人数
   * @param key
   * @param index
   * @param bit
   */
  public async setBitmap(key: string, index: number, bit: number) {
    if (!this.client) {
      await this.getClient();
    }
    await this.client.setbit(key, index, bit);
  }
  public async getBitmap(key: string, index: number) {
    return this.client.getbit(key, index);
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
  public async hSet(key: string, field: string, value: any, seconds?: number) {
    value = JSON.stringify(value);
    if (!this.client) {
      await this.getClient();
    }
    if (!seconds) {
      await this.client.hset(key, field, value);
    } else {
      await this.client.hset(key, field, value, 'EX', seconds);
    }
  }
  public async hGet(key: string, field: string) {
    if (!this.client) {
      await this.getClient();
    }
    const data = await this.client.hget(key, field);
    if (!data) return;
    return JSON.parse(data);
  }
  public async hDel(key: string, field: string) {
    if (!this.client) {
      await this.getClient();
    }
    await this.client.hdel(key, field);
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
