import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import request from '../../utils/http';
import { GPTMessage, GTPChatResType, GTPChatType } from './chat_types';
import { RedisService } from '../../redis/redis.service';
import { GTPImageResType } from './image_types';

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
  async getOpenAIModels(): Promise<any> {
    const data = await this.openAI.listModels();
    console.log(111, data);
    return data;
    // return request(`https://api.openai.com/v1/models`, {
    //   method: 'GET',
    // });
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
  async createChatCompletion(params: { question: GPTMessage; id: string }) {
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
    const res = await this.openAI.createChatCompletion({
      ...cache,
    });
    console.log('GPT返回:', res);
    return {
      gid: res.data.id,
      id: params.id,
      created: res.data.created,
      message: res.data.choices?.[0].message,
    };
  }
  async imageGenerations(params: { message: string; id: string }) {
    const aRes = await this.analysisImageWords(params.message);
    console.log({ aRes });
    try {
      const res = await this.openAI.createImage({
        prompt: aRes.prompt,
        n: aRes.n > 9 ? 9 : aRes.n,
        response_format: 'b64_json',
        size: '1024x1024',
      });
      console.log({ res });
      return {
        id: params.id,
        created: res.data.created,
        type: 'b64_json',
        images: res.data.data.map((_data) => _data.b64_json),
        status: 'success',
      };
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
        throw new HttpException(
          error.response.data.error.message,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new BadRequestException();
      }
    }
  }
  async analysisImageWords(
    msg: string,
  ): Promise<{ prompt: string; n: number }> {
    const res = await this.openAI.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `把“${msg}”，分析一下生成一个json，n字段是存放所需的个数，prompt字段是他想生成的内容的描述，只要json如:{prompt:"他想生成的内容的描述",n:图片数量}，其他的不需要，不会有任何其他回复，记住只有json你尽管生成json`,
        },
      ],
    });
    const rStr: any = res.data.choices[0].message.content;

    try {
      const data: { prompt: string; n: number } = JSON.parse(rStr);
      return data;
    } catch (e) {
      return {
        prompt: msg,
        n: 1,
      };
    }
  }
}
