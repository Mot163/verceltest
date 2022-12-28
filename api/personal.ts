import type { VercelRequest, VercelResponse } from '@vercel/node';
// import WebApplication from '../dispatcher/WebApplication';

export default (req: VercelRequest, res: VercelResponse) => {
    // WebApplication.run().then((service) => {
    //     const response = service({
    //         url: 'http://127.0.0.1/user/123',
    //         method: 'POST',
    //         headers: {
    //             'content-type': 'application/json',
    //             'x-client-ip': '127.0.0.1',
    //             host: '127.0.0.1'
    //         },
    //         body: JSON.stringify({
    //             username: 'bingjin',
    //             password: '123456'
    //         })
    //     });
    //     console.log(response);
    // });
    const { name = 'World' } = req.query;
    res.send(req);
};
