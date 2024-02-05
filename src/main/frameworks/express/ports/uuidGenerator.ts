import { IuuidGenerator } from '@src/domain/interfaces/adapters/uuidGenerator';
import { v4 as uuidv4 } from 'uuid';

export class UuidGenerator implements IuuidGenerator {
  public async generate(): Promise<string> {
    return uuidv4();
  }
}
