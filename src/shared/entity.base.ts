export abstract class EntityBase {
  id: string;

  createdAt: string;
  createdBy: string;

  updatedAt?: string;
  updatedBy?: string;
}
