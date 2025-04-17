import { Injectable } from '@nestjs/common';

import type { BaseRetrieverInterface } from '@langchain/core/retrievers';

import { createRetrieverTool } from 'langchain/tools/retriever';
import { ToolExecutor } from '@langchain/langgraph/prebuilt';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RetrieverService {
  retriever: BaseRetrieverInterface<Record<string, any>>;
  toolExecutor: any;
  constructor(private databaseService: DatabaseService) {
    this.retriever = this.databaseService.getVectorStore().asRetriever();

    const tool = createRetrieverTool(this.retriever, {
      name: 'retrieve_code_files',
      description: 'Retrieves code files',
    });
    this.toolExecutor = new ToolExecutor({
      tools: [tool],
    });
  }

  getRetriever() {
    return this.retriever;
  }
}