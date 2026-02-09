import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './infrastructure/database/MongoConnection';
import userRoutes from './infrastructure/routes/userRoutes';
import todoRoutes from './infrastructure/routes/todoRoutes';
import timeBlockRoutes from './adapters/routes/timeBlockRoutes';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/time-blocks', timeBlockRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
