import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import clsx from 'clsx';
import Layout from '../components/Layout';

interface TimeBlock {
    id: string;
    date: string;
    hours: boolean[];
}

const Tracker: React.FC = () => {
    const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
    const hours = Array.from({ length: 24 }, (_, i) => i);

    useEffect(() => {
        fetchTimeBlocks();
    }, [currentWeekStart]);

    const fetchTimeBlocks = async () => {
        try {
            const endDate = addDays(currentWeekStart, 6);
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get(`http://localhost:5000/api/time-blocks?startDate=${currentWeekStart.toISOString()}&endDate=${endDate.toISOString()}`, config);
            setTimeBlocks(data);
        } catch (error) {
            console.error('Error fetching time blocks:', error);
        }
    };

    const handleToggle = async (day: Date, hourIndex: number) => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            // Optimistic update
            const existingBlockIndex = timeBlocks.findIndex(b => isSameDay(new Date(b.date), day));
            const newTimeBlocks = [...timeBlocks];

            if (existingBlockIndex >= 0) {
                const updatedBlock = { ...newTimeBlocks[existingBlockIndex] };
                updatedBlock.hours = [...updatedBlock.hours];
                updatedBlock.hours[hourIndex] = !updatedBlock.hours[hourIndex];
                newTimeBlocks[existingBlockIndex] = updatedBlock;
            } else {
                // Should ideally create a temp block, but let's rely on backend response for simplicity or re-fetch
            }
            setTimeBlocks(newTimeBlocks);

            await axios.post('http://localhost:5000/api/time-blocks/toggle', {
                date: day.toISOString(),
                hourIndex
            }, config);

            // Re-fetch to ensure sync with backend (creation of new blocks, etc.)
            fetchTimeBlocks();
        } catch (error) {
            console.error('Error toggling time block:', error);
            fetchTimeBlocks(); // Revert on error
        }
    };

    const getBlockForDay = (day: Date) => {
        return timeBlocks.find(b => isSameDay(new Date(b.date), day));
    };

    const navigateWeek = (direction: 'prev' | 'next') => {
        setCurrentWeekStart(prev => addDays(prev, direction === 'prev' ? -7 : 7));
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            Weekly Tracker
                        </h2>
                        <p className="text-gray-400">Track your focus hours (Week of {format(currentWeekStart, 'MMM d')})</p>
                    </div>
                    <div className="flex space-x-4">
                        <button onClick={() => navigateWeek('prev')} className="p-2 bg-surface rounded-lg hover:bg-white/10 transition-colors">
                            <FiChevronLeft size={24} />
                        </button>
                        <button onClick={() => navigateWeek('next')} className="p-2 bg-surface rounded-lg hover:bg-white/10 transition-colors">
                            <FiChevronRight size={24} />
                        </button>
                    </div>
                </header>

                <div className="bg-surface/30 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                    <div className="grid grid-cols-[100px_repeat(24,1fr)] border-b border-white/10">
                        <div className="p-4 font-bold text-gray-400 border-r border-white/10">Day</div>
                        {hours.map(h => (
                            <div key={h} className="p-2 text-center text-xs text-gray-500 border-r border-white/5 last:border-0">
                                {h}:00
                            </div>
                        ))}
                    </div>

                    {weekDays.map(day => {
                        const block = getBlockForDay(day);
                        const isToday = isSameDay(day, new Date());

                        return (
                            <div key={day.toISOString()} className={clsx("grid grid-cols-[100px_repeat(24,1fr)] border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors", isToday && "bg-white/5")}>
                                <div className="p-4 flex flex-col justify-center border-r border-white/10">
                                    <span className={clsx("font-bold text-sm", isToday ? "text-primary" : "text-gray-300")}>{format(day, 'EEE')}</span>
                                    <span className="text-xs text-gray-500">{format(day, 'MMM d')}</span>
                                </div>
                                {hours.map(h => {
                                    const isActive = block?.hours[h] || false;
                                    return (
                                        <div
                                            key={`${day.toISOString()}-${h}`}
                                            onClick={() => handleToggle(day, h)}
                                            className="border-r border-white/5 last:border-0 relative group cursor-pointer"
                                        >
                                            <div className={clsx(
                                                "absolute inset-1 rounded-md transition-all duration-300 transform",
                                                isActive
                                                    ? "bg-gradient-to-br from-primary to-secondary scale-90 shadow-lg shadow-primary/20"
                                                    : "bg-white/5 scale-0 group-hover:scale-75 opacity-0 group-hover:opacity-50"
                                            )} />
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
};

export default Tracker;
