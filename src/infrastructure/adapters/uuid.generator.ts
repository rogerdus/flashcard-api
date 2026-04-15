import { v4 as uuidv4 } from 'uuid';
import { generatorId } from "../../domain/ports/generator-id/generator-id.port";

export default class UuidGenerator implements generatorId {
    generateId(): string {
        return uuidv4();
    }
}