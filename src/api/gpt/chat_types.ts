export type GPTMessage = {
  role: 'user' | 'system' | 'assistant';
  content: string;
};
export type GTPChatType = {
  model: string;
  messages: GPTMessage[];
};
export type GTPChatResType = {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: ChatResUsage;
  choices: ChatResChoice[];
};
type ChatResChoice = {
  message: GPTMessage;
  finish_reason: string;
  index: number;
};
type ChatResUsage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_token: number;
};
