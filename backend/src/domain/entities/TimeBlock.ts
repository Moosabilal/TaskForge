export class TimeBlock {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly date: Date,
        public readonly hours: boolean[] // Array of 24 booleans representing each hour
    ) {
        if (hours.length !== 24) {
            throw new Error('TimeBlock must have exactly 24 hours');
        }
    }
}
