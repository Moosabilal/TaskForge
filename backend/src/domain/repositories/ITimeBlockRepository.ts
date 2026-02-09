import { TimeBlock } from '../entities/TimeBlock';

export interface ITimeBlockRepository {
    save(timeBlock: TimeBlock): Promise<TimeBlock>;
    findByDate(userId: string, date: Date): Promise<TimeBlock | null>;
    findRange(userId: string, startDate: Date, endDate: Date): Promise<TimeBlock[]>;
}
