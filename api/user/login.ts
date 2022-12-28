import type { VercelRequest, VercelResponse } from '@vercel/node';
import UserService from '../../service/UserService';

export default async (req: VercelRequest, res: VercelResponse) => {
    const { username, password } = req.query;
    try {
        const user = UserService.login(<string>username, <string>password);
        res.send(user);
    } catch (error) {
        res.send('error');
    }
};
