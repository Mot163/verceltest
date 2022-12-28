/**
 * 请求接口
 */
interface HttpServletRequest {
    /**
     * 获取请求的资源路径
     */
    getRequestURI(): string;

    /**
     * 获取请求类型（GET、POST、PUT、DELETE和OPTIONS）
     */
    getMethod(): string;

    /**
     * 获取内容类型
     */
    getContentType(): string | undefined;

    /**
     * 获取请求头
     *
     * @param name 请求头名称
     */
    getHeader(name: string): string | undefined;

    /**
     * 获取客户端的IP地址
     */
    getRemoteHost(): string;

    /**
     * 获取服务器主机名
     */
    getServerName(): string;

    /**
     * 获取请求的参数
     *
     * @param name 请求参数名称
     */
    getParameter(name: string): string | undefined;

    /**
     * 获取请求的参数（多个值的时候使用）
     *
     * @param name 请求参数名称
     */
    getParameterValues(name: string): string[] | undefined;

    /**
     * 获取请求体
     */
    getBody(): string | undefined;

    /**
     * 获取域数据
     */
    getAttribute(key: string): any;

    /**
     * 设置域数据
     */
    setAttribute(key: string, value: any): void;
}

export default HttpServletRequest;
