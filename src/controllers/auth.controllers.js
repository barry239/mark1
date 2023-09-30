import jwt from 'jsonwebtoken';
import { matchedData } from 'express-validator';

import User from '../models/User';

const authControllers = {};

authControllers.signUp = async (req, res) => {
    const { email, username, role, password } = matchedData(req);

    const user = await User.methods.getUserByEmail(email);
    if (user) return res.status(409).json({ error: 'Email already exists' });

    const hashedPassword = await User.methods.hashPassword(password);
    const newUser = new User({
        email,
        username,
        role,
        hashedPassword
    });
    const userId = await User.methods.createUser(newUser);

    return res.status(200).json({
        msg: 'User created successfully, please wait until your account is activated',
        id: userId
    });
}

authControllers.signIn = async (req, res) => {
    const { email, password } = matchedData(req);

    const user = await User.methods.getUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Incorrect email / password' });

    const match = await User.methods.comparePassword(password, user.hashedPassword);
    if (!match) return res.status(401).json({ error: 'Incorrect email / password' });

    if (!user.activated) return res.status(403).json({ error: 'Account not activated' });

    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
        expiresIn: process.env.EXPIRATION_TIME
    });

    return res.status(200).json({
        accessToken: token,
        tokenType: 'JWT',
        expiresIn: process.env.EXPIRATION_TIME
    });
}

export default authControllers;
