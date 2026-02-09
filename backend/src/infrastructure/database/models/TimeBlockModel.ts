import mongoose, { Schema, Document } from 'mongoose';

export interface ITimeBlockDocument extends Document {
    userId: string;
    date: Date;
    hours: boolean[];
}

const TimeBlockSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    hours: { type: [Boolean], required: true, validate: [(val: boolean[]) => val.length === 24, 'Must have 24 hours'] }
}, { timestamps: true });

// Compound index to ensure one block per day per user
TimeBlockSchema.index({ userId: 1, date: 1 }, { unique: true });

export const TimeBlockModel = mongoose.model<ITimeBlockDocument>('TimeBlock', TimeBlockSchema);
