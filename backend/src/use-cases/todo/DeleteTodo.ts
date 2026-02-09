import { ITodoRepository } from '../../domain/repositories/ITodoRepository';

export class DeleteTodo {
    constructor(private todoRepository: ITodoRepository) { }

    async execute(id: string, userId: string): Promise<void> {
        const todo = await this.todoRepository.findById(id);

        if (!todo) {
            throw new Error('Todo not found');
        }

        if (todo.userId !== userId) {
            throw new Error('Unauthorized');
        }

        await this.todoRepository.delete(id);
    }
}
