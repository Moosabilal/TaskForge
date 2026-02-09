import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { UserModel } from '../database/models/UserModel';

export class MongoUserRepository implements IUserRepository {
    async save(user: User): Promise<User> {
        const newUser = new UserModel({
            name: user.name,
            email: user.email,
            passwordHash: user.password
        });
        await newUser.save();
        return new User(newUser._id.toString(), newUser.name, newUser.email, newUser.passwordHash);
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({ email });
        if (!user) return null;
        return new User(user._id.toString(), user.name, user.email, user.passwordHash);
    }
}
