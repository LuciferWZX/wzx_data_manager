import { Controller, Get, HttpCode, Post } from '@nestjs/common';
import { GPTService } from './service';

@Controller('gpt')
export class GPTController {
  constructor(private gptService: GPTService) {}
  @Get('/test')
  @HttpCode(200)
  async test() {
    return 'xxx';
  }
  @Get('/models')
  @HttpCode(200)
  async getModels() {
    return this.gptService.getOpenAIModels();
  }
  @Get('/completion')
  @HttpCode(200)
  async createCompletion() {
    return this.gptService.createCompletion();
  }
}
