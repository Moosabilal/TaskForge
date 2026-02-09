import { ITodoRepository } from '../../domain/repositories/ITodoRepository';
import { Todo } from '../../domain/entities/Todo';
import { TodoModel } from '../database/models/TodoModel';

export class MongoTodoRepository implements ITodoRepository {
    async save(todo: Todo): Promise<Todo> {
        const newTodo = new TodoModel({
            userId: todo.userId,
            title: todo.title,
            completed: todo.completed,
            dueDate: todo.dueDate
        });
        await newTodo.save();
        return new Todo(newTodo._id.toString(), newTodo.userId.toString(), newTodo.title, newTodo.completed, newTodo.createdAt, newTodo.dueDate);
    }

    async findByUserId(userId: string): Promise<Todo[]> {
        const todos = await TodoModel.find({ userId }).sort({ createdAt: -1 });
        return todos.map(todo => new Todo(todo._id.toString(), todo.userId.toString(), todo.title, todo.completed, todo.createdAt, todo.dueDate));
    }

    async findById(id: string): Promise<Todo | null> {
        const todo = await TodoModel.findById(id);
        if (!todo) return null;
        return new Todo(todo._id.toString(), todo.userId.toString(), todo.title, todo.completed, todo.createdAt, todo.dueDate);
    }

    async update(todo: Todo): Promise<Todo> {
        const updatedTodo = await TodoModel.findByIdAndUpdate(
            todo.id,
            { title: todo.title, completed: todo.completed, dueDate: todo.dueDate },
            { new: true }
        );
        if (!updatedTodo) throw new Error('Todo not found');
        return new Todo(updatedTodo._id.toString(), updatedTodo.userId.toString(), updatedTodo.title, updatedTodo.completed, updatedTodo.createdAt, updatedTodo.dueDate);
    }

    async delete(id: string): Promise<void> {
        await TodoModel.findByIdAndDelete(id);
    }
}
