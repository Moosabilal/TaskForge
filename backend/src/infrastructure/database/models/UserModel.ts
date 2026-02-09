import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../../../domain/entities/User';

export interface UserDocument extends Document {
    name: string;
    email: string;
    passwordHash: string;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }
}, {
    timestamps: true
});

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
