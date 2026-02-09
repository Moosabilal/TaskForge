import { ITimeBlockRepository } from '../../domain/repositories/ITimeBlockRepository';
import { TimeBlock } from '../../domain/entities/TimeBlock';

export class ToggleTimeBlock {
    constructor(private timeBlockRepository: ITimeBlockRepository) { }

    async execute(userId: string, date: Date, hourIndex: number): Promise<TimeBlock> {
        if (hourIndex < 0 || hourIndex > 23) {
            throw new Error('Hour index must be between 0 and 23');
        }

        let timeBlock = await this.timeBlockRepository.findByDate(userId, date);

        if (!timeBlock) {
            // Create new block with all false, except the toggled one
            const hours = new Array(24).fill(false);
            hours[hourIndex] = true;
            timeBlock = new TimeBlock('', userId, date, hours);
        } else {
            // Toggle existing
            const newHours = [...timeBlock.hours];
            newHours[hourIndex] = !newHours[hourIndex];
            timeBlock = new TimeBlock(timeBlock.id, userId, date, newHours);
        }

        return await this.timeBlockRepository.save(timeBlock);
    }
}
