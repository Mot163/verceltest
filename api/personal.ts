import type { VercelRequest, VercelResponse } from '@vercel/node';
import WebApplication from '../dispatcher/WebApplication';

export default async (req: VercelRequest, res: VercelResponse) => {
    const url = new URL(`https://api.mobingc.cn${req.url}`);
    const response = await WebApplication.run().then((service) => {
        return service({
            url: url.origin + url.pathname,
            method: req.method,
            headers: <any>req.headers,
            body: req.body
        });
    });
    res.send(response.getBody());
};
