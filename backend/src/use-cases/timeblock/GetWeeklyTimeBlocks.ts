import { ITimeBlockRepository } from '../../domain/repositories/ITimeBlockRepository';
import { TimeBlock } from '../../domain/entities/TimeBlock';

export class GetWeeklyTimeBlocks {
    constructor(private timeBlockRepository: ITimeBlockRepository) { }

    async execute(userId: string, startDate: Date, endDate: Date): Promise<TimeBlock[]> {
        return await this.timeBlockRepository.findRange(userId, startDate, endDate);
    }
}
