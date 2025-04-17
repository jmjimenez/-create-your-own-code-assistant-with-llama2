import { Injectable } from '@nestjs/common';

import {
  DirectoryLoader,
  UnknownHandling,
} from 'langchain/document_loaders/fs/directory';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class DataProcessingService {
  constructor(
    private config: ConfigService,
    private databaseService: DatabaseService,
  ) {}

  async extractAndStoreData(directory): Promise<void> {
    const docs = await this.loadWorkspace(directory);
    const texts = await this.extract(docs);
    await this.storeGraph(texts);
  }

  /**
   * Loads the current workspace into embedings
   */
  async loadWorkspace(directory) {
    const REPO_PATH = directory || this.config.get<string>('workspace');
    const loaders = this.config.get<string[]>('loaders') || [
      '.ts',
      '.js',
      '.json',
      '.jsonc',
      '.md',
    ];
    const exclude_globs = this.config.get<string[]>('exclude');

    const loads = loaders.reduce((acc, cur) => {
      acc[cur] = (path) => new TextLoader(path);
      return acc;
    }, {});

    const loader = new DirectoryLoader(
      REPO_PATH,
      loads,
      true,
      UnknownHandling.Ignore,
      exclude_globs,
    );

    const docs = await loader.load();
    return docs;
  }

  async extract(docs: any) {
    const javascriptSplitter = RecursiveCharacterTextSplitter.fromLanguage(
      'js',
      {
        chunkSize: 2000,
        chunkOverlap: 200,
      },
    );
    const texts = await javascriptSplitter.splitDocuments(docs);

    console.log('Loaded ', texts.length, ' documents.');

    return texts;
  }

  async storeGraph(texts: any): Promise<any> {
    this.databaseService.addDocuments(texts);
  }
}