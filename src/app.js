import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

import indexRoutes from './routes/index.routes';
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';

// Initializations
const app = express();
dotenv.config();

// Settings
app.set('port', process.env.PORT || 4000);

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use(indexRoutes);
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);

export default app;
