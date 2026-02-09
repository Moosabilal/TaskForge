import { ITodoRepository } from '../../domain/repositories/ITodoRepository';
import { Todo } from '../../domain/entities/Todo';

export class UpdateTodo {
    constructor(private todoRepository: ITodoRepository) { }

    async execute(id: string, userId: string, updates: Partial<Todo>): Promise<Todo> {
        const todo = await this.todoRepository.findById(id);

        if (!todo) {
            throw new Error('Todo not found');
        }

        if (todo.userId !== userId) {
            throw new Error('Unauthorized');
        }

        const updatedTodo = new Todo(
            todo.id,
            todo.userId,
            updates.title ?? todo.title,
            updates.completed ?? todo.completed,
            todo.createdAt,
            updates.dueDate ?? todo.dueDate
        );

        return await this.todoRepository.update(updatedTodo);
    }
}
