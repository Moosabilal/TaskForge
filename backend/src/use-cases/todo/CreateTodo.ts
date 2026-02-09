import { ITodoRepository } from '../../domain/repositories/ITodoRepository';
import { Todo } from '../../domain/entities/Todo';

export class CreateTodo {
    constructor(private todoRepository: ITodoRepository) { }

    async execute(userId: string, title: string): Promise<Todo> {
        if (!title) throw new Error('Title is required');

        const todo = new Todo(
            '',
            userId,
            title,
            false,
            new Date()
        );

        return await this.todoRepository.save(todo);
    }
}
