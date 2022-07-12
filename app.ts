import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import authRoutes from './routes/auth.routes';

const app = express();

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

async function start(): Promise<void> {
    try {
        await mongoose.connect(process.env.mongoUri as string);
        app.listen(5000, (): void => console.log(`App has been started on port ${PORT}...`));
    } catch (e: unknown) {
        const error = e as Error;
        console.error('Server error', error.message);
        process.exit(1);
    }
}

start();
