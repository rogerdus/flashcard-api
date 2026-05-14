import { DomainEvent } from "./domain.event"

export class CategoryArchived extends DomainEvent {
    readonly eventName: string  = "category.archived";

    constructor(
        public readonly categoryId: string,
        public readonly name: string,
    ){
        super();
    }
}