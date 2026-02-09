import { Request, Response } from 'express';
import { RegisterUser } from '../../use-cases/user/RegisterUser';
import { LoginUser } from '../../use-cases/user/LoginUser';
import { MongoUserRepository } from '../../infrastructure/repositories/MongoUserRepository';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const userRepository = new MongoUserRepository();
const registerUser = new RegisterUser(userRepository);
const loginUser = new LoginUser(userRepository);

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const user = await registerUser.execute(name, email, password);
        const token = generateToken(user.id);

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            token
        });
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await loginUser.execute(email, password);
        const token = generateToken(user.id);

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            token
        });
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};
