import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';

export default async (req: VercelRequest, res: VercelResponse) => {
    if (!process.env.MONGODB_URI) {
        res.send('please set env MONGODB_URI');
        return;
    }
    await mongoose.connect(process.env.MONGODB_URI);
    const schema = new mongoose.Schema({ name: String, grades: Number });
    const stuModel = mongoose.model('grades', schema);
    new stuModel({ name: '小明', grades: 68 }).save();
    const result = await new stuModel({ name: '小明', grades: 68 }).save();
    res.send(result);
};
