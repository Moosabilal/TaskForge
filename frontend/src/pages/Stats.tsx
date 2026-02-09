import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { format, subDays, isSameDay } from 'date-fns';

interface Todo {
    id: string;
    completed: boolean;
    createdAt: string;
}

const Stats: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/todos', config);
                setTodos(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchTodos();
    }, [userInfo.token]);

    // Calculate Stats
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;

    const completionData = [
        { name: 'Completed', value: completed },
        { name: 'Pending', value: pending },
    ];

    const COLORS = ['#6366f1', '#334155']; // Primary, Surface-light

    // Last 7 Days Activity
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        return {
            date: format(date, 'MMM dd'),
            created: todos.filter(t => isSameDay(new Date(t.createdAt), date)).length,
            completed: todos.filter(t => t.completed && isSameDay(new Date(t.createdAt), date)).length // Simplified: assuming completion time ~ creation time for demo
        };
    });

    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-8">
                <header>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        Statistics
                    </h2>
                    <p className="text-gray-400">Overview of your productivity</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-surface/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                        <h3 className="text-gray-400 text-sm uppercase">Total Tasks</h3>
                        <p className="text-4xl font-bold text-white mt-2">{total}</p>
                    </div>
                    <div className="bg-surface/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                        <h3 className="text-gray-400 text-sm uppercase">Completed</h3>
                        <p className="text-4xl font-bold text-primary mt-2">{completed}</p>
                    </div>
                    <div className="bg-surface/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                        <h3 className="text-gray-400 text-sm uppercase">Pending</h3>
                        <p className="text-4xl font-bold text-accent mt-2">{pending}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Completion Rate Chart */}
                    <div className="bg-surface/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm h-[400px]">
                        <h3 className="text-xl font-bold mb-6">Completion Rate</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={completionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {completionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Weekly Activity Chart */}
                    <div className="bg-surface/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm h-[400px]">
                        <h3 className="text-xl font-bold mb-6">Weekly Activity</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={last7Days}>
                                <XAxis dataKey="date" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Bar dataKey="created" fill="#a855f7" radius={[4, 4, 0, 0]} name="Tasks Created" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Stats;
