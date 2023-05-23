import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import request from '../../utils/http';

@Injectable()
export class GPTService {
  apiKey = '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';
  organization = 'org-fJ8q1BgXk1kL3zEC3F1CPT1M';
  openAI: any;
  constructor() {
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
  // async testGPT() {}
}
