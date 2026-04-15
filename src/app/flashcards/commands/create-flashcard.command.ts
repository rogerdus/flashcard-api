export class CreateFlashcardCommand {
    constructor(
        public readonly question: string,
        public readonly answer: string,
        public readonly categoryId: string,
    ) {}
}