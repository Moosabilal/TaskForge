import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiCheck, FiClock } from 'react-icons/fi';
import clsx from 'clsx';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import Layout from '../components/Layout';

interface Todo {
    id: string;
    title: string;
    completed: boolean;
    dueDate?: string;
    createdAt: string;
}

const Dashboard: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    const config = {
        headers: {
            Authorization: `Bearer ${userInfo.token}`
        }
    };

    const fetchTodos = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/todos', config);
            setTodos(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!userInfo.token) {
            navigate('/login');
        } else {
            fetchTodos();
        }
    }, [navigate]);

    const handleCreateTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/todos', { title, dueDate }, config);
            setTitle('');
            setDueDate('');
            fetchTodos();
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggleTodo = async (todo: Todo) => {
        try {
            await axios.put(`http://localhost:5000/api/todos/${todo.id}`, { completed: !todo.completed }, config);
            fetchTodos();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteTodo = async (id: string) => {
        try {
            await axios.delete(`http://localhost:5000/api/todos/${id}`, config);
            fetchTodos();
        } catch (error) {
            console.error(error);
        }
    };

    const groupTodos = (todos: Todo[]) => {
        const groups: { [key: string]: Todo[] } = {
            'Overdue': [],
            'Today': [],
            'Tomorrow': [],
            'Upcoming': [],
            'No Date': []
        };

        todos.forEach(todo => {
            if (!todo.dueDate) {
                groups['No Date'].push(todo);
            } else {
                const date = new Date(todo.dueDate);
                if (isPast(date) && !isToday(date) && !todo.completed) groups['Overdue'].push(todo);
                else if (isToday(date)) groups['Today'].push(todo);
                else if (isTomorrow(date)) groups['Tomorrow'].push(todo);
                else groups['Upcoming'].push(todo);
            }
        });
        return groups;
    };

    const groupedTodos = groupTodos(todos);

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        My Tasks
                    </h2>
                    <p className="text-gray-400">Keep track of your daily goals</p>
                </header>

                <form onSubmit={handleCreateTodo} className="mb-10 bg-surface/50 p-4 rounded-2xl border border-white/5 backdrop-blur-sm flex gap-4 items-center shadow-xl">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Add a new task..."
                            className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
                        />
                    </div>
                    <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="bg-transparent text-gray-400 text-sm focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="p-3 bg-gradient-to-r from-primary to-secondary rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all transform hover:scale-105"
                    >
                        <FiPlus size={24} />
                    </button>
                </form>

                <div className="space-y-8">
                    {Object.entries(groupedTodos).map(([group, tasks]) => (
                        tasks.length > 0 && (
                            <section key={group}>
                                <h3 className={clsx(
                                    "text-sm font-bold uppercase tracking-wider mb-4",
                                    group === 'Overdue' ? "text-red-400" : "text-gray-500"
                                )}>
                                    {group} ({tasks.length})
                                </h3>
                                <div className="space-y-3">
                                    <AnimatePresence>
                                        {tasks.map((todo) => (
                                            <motion.div
                                                key={todo.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="group flex items-center justify-between p-4 bg-surface rounded-xl border border-white/5 hover:border-primary/50 transition-all hover:bg-surface/80 shadow-sm"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <button
                                                        onClick={() => handleToggleTodo(todo)}
                                                        className={clsx(
                                                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                                            todo.completed
                                                                ? "bg-green-500 border-green-500"
                                                                : "border-gray-500 group-hover:border-primary"
                                                        )}
                                                    >
                                                        {todo.completed && <FiCheck size={14} />}
                                                    </button>
                                                    <div className="flex flex-col">
                                                        <span className={clsx("font-medium transition-all", todo.completed && "line-through text-gray-500")}>
                                                            {todo.title}
                                                        </span>
                                                        {todo.dueDate && (
                                                            <span className={clsx("text-xs flex items-center gap-1",
                                                                isPast(new Date(todo.dueDate)) && !todo.completed ? "text-red-400" : "text-gray-500"
                                                            )}>
                                                                <FiClock size={10} />
                                                                {format(new Date(todo.dueDate), 'MMM d, yyyy')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteTodo(todo.id)}
                                                    className="p-2 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-400/10"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </section>
                        )
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
