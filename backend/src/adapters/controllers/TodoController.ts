import { Request, Response } from 'express';
import { CreateTodo } from '../../use-cases/todo/CreateTodo';
import { GetTodos } from '../../use-cases/todo/GetTodos';
import { UpdateTodo } from '../../use-cases/todo/UpdateTodo';
import { DeleteTodo } from '../../use-cases/todo/DeleteTodo';
import { MongoTodoRepository } from '../../infrastructure/repositories/MongoTodoRepository';

const todoRepository = new MongoTodoRepository();
const createTodo = new CreateTodo(todoRepository);
const getTodos = new GetTodos(todoRepository);
const updateTodo = new UpdateTodo(todoRepository);
const deleteTodo = new DeleteTodo(todoRepository);

export const create = async (req: Request, res: Response) => {
    try {
        const { title, dueDate } = req.body;
        const userId = (req as any).user.id;
        const todo = await createTodo.execute(userId, title, dueDate);
        res.status(201).json(todo);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const todos = await getTodos.execute(userId);
        res.json(todos);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const userId = (req as any).user.id;
        const todo = await updateTodo.execute(id as string, userId, updates);
        res.json(todo);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;
        await deleteTodo.execute(id as string, userId);
        res.json({ message: 'Todo removed' });
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};
