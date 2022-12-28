import { Response, BodyInit, ResponseInit } from 'node-fetch';
import HttpServletResponse from '../../web/servlet/http/HttpServletResponse';

/**
 * 响应参数
 */
type ResponseParameter = {
    body?: BodyInit | null;
    init?: ResponseInit;
};

/**
 * 响应
 */
class HttpResponse extends Response implements HttpServletResponse {
    /** 响应状态 */
    private _status: number;

    /** 响应消息 */
    private message: string;

    /** 响应体 */
    private _body: NodeJS.ReadableStream | null;

    /**
     * @param param 响应构建参数
     */
    constructor(param?: ResponseParameter) {
        super(param?.body, param?.init);
        this.message = this.statusText;
        this._status = this.status;
        this._body = this.body;
    }

    /**
     * 获取Header
     *
     * @param name Header键名
     */
    public getHeader(name: string): string | undefined {
        return this.headers.get(name) || undefined;
    }

    /**
     * 设置Header
     *
     * @param name Header键名
     * @param value Header键值
     */
    public setHeader(name: string, value: string): void {
        this.headers.set(name, value);
    }

    /**
     * 获取响应状态
     */
    public getStatus(): number {
        return this._status;
    }

    /**
     * 设置响应状态
     *
     * @param status 响应状态
     */
    public setStatus(status: number): void {
        this._status = status;
    }

    /**
     * 获取响应消息
     */
    public getMessage(): string {
        return this.message;
    }

    /**
     * 设置响应消息
     *
     * @param message 响应状态
     */
    public setMessage(message: string): void {
        this.message = message;
    }

    /**
     * 获取响应体
     */
    public getBody(): string | Buffer | undefined {
        return this._body?.read() || undefined;
    }

    /**
     * 设置响应体
     *
     * @param body 响应体
     */
    public setBody(body: string | Buffer): void {
        this._body = new Response(body).body;
    }

    /**
     * 设置内容类型
     *
     * @param contentType 内容类型
     */
    public setContentType(contentType: string): void {
        this.headers.set('content-type', contentType);
    }

    /**
     * 发送错误
     *
     * @param status 响应状态
     * @param message 响应信息
     */
    public sendError(status: number, message?: string) {
        this._status = status;
        this.message = message ?? 'error';
    }
}

export default HttpResponse;
export { ResponseParameter };
