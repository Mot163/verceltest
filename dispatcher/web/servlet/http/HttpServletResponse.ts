/**
 * 响应接口
 */
interface HttpServletResponse {
    /**
     * 获取Header
     *
     * @param name Header键名
     */
    getHeader(name: string): string | undefined;

    /**
     * 设置Header
     *
     * @param name Header键名
     * @param value Header键值
     */
    setHeader(name: string, value: string): void;

    /**
     * 获取响应状态
     */
    getStatus(): number;

    /**
     * 设置响应状态
     *
     * @param status 响应状态
     */
    setStatus(status: number): void;

    /**
     * 获取响应消息
     */
    getMessage(): string;

    /**
     * 设置响应消息
     *
     * @param message 响应状态
     */
    setMessage(message: string): void;

    /**
     * 获取响应体
     */
    getBody(): any;

    /**
     * 设置响应体
     *
     * @param body 响应体
     */
    setBody(body: any): void;

    /**
     * 设置内容类型
     *
     * @param contentType 内容类型
     */
    setContentType(contentType: string): void;

    /**
     * 发送错误
     *
     * @param status 响应状态
     * @param message 响应信息
     */
    sendError(status: number, message?: string): void;
}

export default HttpServletResponse;
