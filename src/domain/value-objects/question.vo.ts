export class Question {
    readonly value: string;

    constructor(value: string) {
        if(!value || value.trim().length === 0){
            throw new Error("Question is required");
        }

        if(value.trim().length < 5){
            throw new Error("Question must be at least 5 characters long");  
        }
        this.value = value.trim();
    }

}