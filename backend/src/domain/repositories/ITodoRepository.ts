import { Todo } from '../entities/Todo';

export interface ITodoRepository {
    save(todo: Todo): Promise<Todo>;
    findByUserId(userId: string): Promise<Todo[]>;
    findById(id: string): Promise<Todo | null>;
    update(todo: Todo): Promise<Todo>;
    delete(id: string): Promise<void>;
}
