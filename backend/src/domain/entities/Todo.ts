export class Todo {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly title: string,
        public readonly completed: boolean,
        public readonly createdAt: Date,
        public readonly dueDate?: Date
    ) { }
}
