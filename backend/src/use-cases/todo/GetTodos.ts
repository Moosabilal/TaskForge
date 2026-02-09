import { ITodoRepository } from '../../domain/repositories/ITodoRepository';
import { Todo } from '../../domain/entities/Todo';

export class GetTodos {
    constructor(private todoRepository: ITodoRepository) { }

    async execute(userId: string): Promise<Todo[]> {
        return await this.todoRepository.findByUserId(userId);
    }
}
