import { Container, CosmosClient } from '@azure/cosmos';
import { ConfigService } from '@nestjs/config';

export class CosmosDBClient {
  private client: CosmosClient;
  private container: Container;

  constructor(endpoint: string, apiKey: string, databaseId: string, containerId: string, ) {
    this.client = new CosmosClient({
      endpoint: endpoint,
      key: apiKey,
    });
    this.container = this.client
      .database(databaseId)
      .container(containerId);
  }

  async query(query: string): Promise<any[]> {
    const { resources } = await this.container.items.query(query).fetchAll();
    return resources;
  }

  async fetchAll(): Promise<any[]> {
    const { resources } = await this.container.items.readAll().fetchAll();
    return resources;
  }

  async getById(documentId: any): Promise<any> {
    const { resource } = await this.container.item(documentId).read();
    return resource;
  }

  async create(document: any): Promise<any> {
    const { resource: createdDocument } = await this.container.items.create(
      document,
    );
    return createdDocument;
  }

  async update(documentId: any, document: any): Promise<any> {
    const existingDocument = await this.getById(documentId);
    const updatedDocument = { ...existingDocument, ...document };
    const { resource } = await this.container
      .item(documentId)
      .replace(updatedDocument);
    return resource;
  }

  async delete(documentId: any): Promise<any> {
    const { resource } = await this.container.item(documentId).delete();
    return resource;
  }
}
