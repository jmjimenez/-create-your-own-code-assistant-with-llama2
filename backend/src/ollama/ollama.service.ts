import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { OllamaEmbeddings, ChatOllama } from '@langchain/ollama';

@Injectable()
export class OllamaService {
  embedings: OllamaEmbeddings;
  chat: ChatOllama;

  constructor(private configService: ConfigService) {
    this.embedings = new OllamaEmbeddings({
      model: this.configService.get<string>('model'), //'llama2', // default value
      baseUrl: this.configService.get<string>('url'), //'http://localhost:11434', // default value
      requestOptions:
        this.configService.get<Record<string, string>>('requestOptions'),
    });
    this.chat = new ChatOllama({
      model: this.configService.get<string>('model'), //'llama2', // default value
      baseUrl: this.configService.get<string>('url'), //'http://localhost:11434', // default value
      format: this.configService.get<string>('format'), //'json', // default value
      temperature: this.configService.get<number>('chatTemperature', 0.5), // default value
      topP: this.configService.get<number>('topP', 1), // default value
      topK: this.configService.get<number>('topK', 40), // default value
    });
  }
  getEmbeddings(): OllamaEmbeddings {
    return this.embedings;
  }
  getChat(): ChatOllama {
    return this.chat;
  }
  async sendPrompt(prompt: string) {
    return this.chat.invoke(prompt);
  }
}
