import mongoose, { Schema, Document } from 'mongoose';

export interface TodoDocument extends Document {
    userId: string;
    title: string;
    completed: boolean;
    createdAt: Date;
}

const TodoSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
}, {
    timestamps: true
});

export const TodoModel = mongoose.model<TodoDocument>('Todo', TodoSchema);
