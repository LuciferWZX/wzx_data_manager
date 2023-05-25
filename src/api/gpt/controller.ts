import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { GPTService } from './service';
import { GPTMessage } from './chat_types';

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
  @Post('/chat')
  @HttpCode(200)
  async createChatCompletion(
    @Body() params: { question: GPTMessage; id: string },
  ) {
    const { question, id } = params;

    return this.gptService.createChatCompletion({ question, id });
  }
}
