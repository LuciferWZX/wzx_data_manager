import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import request from '../../utils/http';
import { GPTMessage, GTPChatResType, GTPChatType } from './chat_types';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class GPTService {
  apiKey = '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';
  organization = 'org-fJ8q1BgXk1kL3zEC3F1CPT1M';
  openAI: OpenAIApi;

  constructor(private redisService: RedisService) {
    const configuration = new Configuration({
      organization: this.organization,
      apiKey: this.apiKey,
    });
    this.openAI = new OpenAIApi(configuration);
  }
  async getOpenAIModels() {
    return request(`https://api.openai.com/v1/models`, {
      method: 'GET',
    });
  }
  async createCompletion() {
    return request(`https://api.openai.com/v1/completions`, {
      method: 'POST',
      data: {
        model: 'text-davinci-003',
        prompt: '1+1等于几',
        max_tokens: 7,
        temperature: 0,
        top_p: 1,
        n: 1,
        stream: false,
        logprobs: null,
        // stop: '\n',
      },
    });
  }
  async createChatCompletion(params: { question: GPTMessage }) {
    let cache = await this.redisService.hGet<GTPChatType>('chat', 'test_id');
    if (cache) {
      cache.messages.push(params.question);
    } else {
      cache = {
        model: 'gpt-3.5-turbo',
        messages: [params.question],
      };
    }
    await this.redisService.hSet('chat', 'test_id', cache);
    const res = await request<GTPChatResType>(
      `https://api.openai.com/v1/chat/completions`,
      {
        method: 'POST',
        data: cache,
      },
    );
    return {
      id: res.id,
      created: res.created,
      message: res.choices?.[0].message,
    };
  }
  // async testGPT() {}
}
