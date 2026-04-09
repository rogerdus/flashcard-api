import { DomainError } from "./domain.error";

export class CategoryAlreadyExistsError extends DomainError{
    constructor(name: string){
        super(`Category ${name} already exists`)
    }
}