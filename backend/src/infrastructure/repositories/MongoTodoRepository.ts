import { ITodoRepository } from '../../domain/repositories/ITodoRepository';
import { Todo } from '../../domain/entities/Todo';
import { TodoModel } from '../database/models/TodoModel';

export class MongoTodoRepository implements ITodoRepository {
    async save(todo: Todo): Promise<Todo> {
        const newTodo = new TodoModel({
            userId: todo.userId,
            title: todo.title,
            completed: todo.completed
        });
        await newTodo.save();
        return new Todo(newTodo._id.toString(), newTodo.userId, newTodo.title, newTodo.completed, newTodo.createdAt);
    }

    async findByUserId(userId: string): Promise<Todo[]> {
        const todos = await TodoModel.find({ userId }).sort({ createdAt: -1 });
        return todos.map(todo => new Todo(todo._id.toString(), todo.userId, todo.title, todo.completed, todo.createdAt));
    }

    async findById(id: string): Promise<Todo | null> {
        const todo = await TodoModel.findById(id);
        if (!todo) return null;
        return new Todo(todo._id.toString(), todo.userId, todo.title, todo.completed, todo.createdAt);
    }

    async update(todo: Todo): Promise<Todo> {
        const updatedTodo = await TodoModel.findByIdAndUpdate(
            todo.id,
            { title: todo.title, completed: todo.completed },
            { new: true }
        );
        if (!updatedTodo) throw new Error('Todo not found');
        return new Todo(updatedTodo._id.toString(), updatedTodo.userId, updatedTodo.title, updatedTodo.completed, updatedTodo.createdAt);
    }

    async delete(id: string): Promise<void> {
        await TodoModel.findByIdAndDelete(id);
    }
}
