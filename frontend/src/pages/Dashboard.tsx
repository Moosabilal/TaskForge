import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiPlus, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import clsx from 'clsx';

interface Todo {
    id: string;
    title: string;
    completed: boolean;
}

const Dashboard: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [title, setTitle] = useState('');
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

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const handleCreateTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/todos', { title }, config);
            setTitle('');
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

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <nav className="flex items-center justify-between px-6 py-4 bg-gray-800 shadow-md">
                <h1 className="text-2xl font-bold text-indigo-400">Todo App</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-300">Welcome, {userInfo.name}</span>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <FiLogOut size={20} />
                    </button>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto mt-10 p-6">
                <form onSubmit={handleCreateTodo} className="mb-8 flex space-x-4">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="What needs to be done?"
                        className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                    >
                        <FiPlus /> <span>Add</span>
                    </button>
                </form>

                <div className="space-y-4">
                    <AnimatePresence>
                        {todos.map((todo) => (
                            <motion.div
                                key={todo.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className={clsx(
                                    "flex items-center justify-between p-4 bg-gray-800 rounded-lg shadow-sm border-l-4 transition-all",
                                    todo.completed ? "border-green-500 bg-gray-800/50" : "border-indigo-500"
                                )}
                            >
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => handleToggleTodo(todo)}
                                        className={clsx(
                                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                            todo.completed ? "bg-green-500 border-green-500" : "border-gray-500 hover:border-indigo-500"
                                        )}
                                    >
                                        {todo.completed && <FiCheck size={14} />}
                                    </button>
                                    <span className={clsx("text-lg", todo.completed && "line-through text-gray-500")}>
                                        {todo.title}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDeleteTodo(todo.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <FiTrash2 />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {todos.length === 0 && (
                        <p className="text-center text-gray-500 mt-10">No tasks yet. Add one above!</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
