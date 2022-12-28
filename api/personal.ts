import type { VercelRequest, VercelResponse } from '@vercel/node';

export default (req: VercelRequest, res: VercelResponse) => {
    const { name = 'World' } = req.query;
    res.send(JSON.stringify(req));
};