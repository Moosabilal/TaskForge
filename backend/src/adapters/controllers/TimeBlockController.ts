import { Request, Response } from 'express';
import { GetWeeklyTimeBlocks } from '../../use-cases/timeblock/GetWeeklyTimeBlocks';
import { ToggleTimeBlock } from '../../use-cases/timeblock/ToggleTimeBlock';
import { MongoTimeBlockRepository } from '../../infrastructure/repositories/MongoTimeBlockRepository';

const timeBlockRepository = new MongoTimeBlockRepository();
const getWeeklyTimeBlocks = new GetWeeklyTimeBlocks(timeBlockRepository);
const toggleTimeBlock = new ToggleTimeBlock(timeBlockRepository);

export const getWeekly = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required' });
        }

        const start = new Date(startDate as string);
        const end = new Date(endDate as string);

        const blocks = await getWeeklyTimeBlocks.execute(userId, start, end);
        res.json(blocks);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const toggleBlock = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { date, hourIndex } = req.body;

        if (!date || hourIndex === undefined) {
            return res.status(400).json({ message: 'Date and hourIndex are required' });
        }

        const blockDate = new Date(date);
        const updatedBlock = await toggleTimeBlock.execute(userId, blockDate, hourIndex);
        res.json(updatedBlock);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
