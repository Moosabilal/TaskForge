import { ITimeBlockRepository } from '../../domain/repositories/ITimeBlockRepository';
import { TimeBlock } from '../../domain/entities/TimeBlock';
import { TimeBlockModel } from '../database/models/TimeBlockModel';

export class MongoTimeBlockRepository implements ITimeBlockRepository {
    async save(timeBlock: TimeBlock): Promise<TimeBlock> {
        const update = {
            userId: timeBlock.userId,
            date: timeBlock.date,
            hours: timeBlock.hours
        };

        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        // Use findOneAndUpdate with upsert to handle both create and update
        // Searching by userId and date (ignoring time component of date for query if needed, but assuming exact date match from service)
        // Ideally, the service should normalize dates to midnight UTC or similar.
        const doc = await TimeBlockModel.findOneAndUpdate(
            { userId: timeBlock.userId, date: timeBlock.date },
            update,
            options
        );

        return new TimeBlock(doc._id.toString(), doc.userId.toString(), doc.date, doc.hours);
    }

    async findByDate(userId: string, date: Date): Promise<TimeBlock | null> {
        const doc = await TimeBlockModel.findOne({ userId, date });
        if (!doc) return null;
        return new TimeBlock(doc._id.toString(), doc.userId.toString(), doc.date, doc.hours);
    }

    async findRange(userId: string, startDate: Date, endDate: Date): Promise<TimeBlock[]> {
        const docs = await TimeBlockModel.find({
            userId,
            date: { $gte: startDate, $lte: endDate }
        });
        return docs.map(doc => new TimeBlock(doc._id.toString(), doc.userId.toString(), doc.date, doc.hours));
    }
}
