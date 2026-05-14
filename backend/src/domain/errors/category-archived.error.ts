import { DomainError } from "./domain.error";
import { Category } from '../entities/category/category.entity';

export class CategoryArchivedError extends DomainError{
    constructor(id: string){
        super(`Category ${id} is archived and cannot be modified `)
    }
}