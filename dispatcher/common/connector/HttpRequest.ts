import { Request, RequestInfo, RequestInit } from 'node-fetch';
import HttpServletRequest from '../../web/servlet/http/HttpServletRequest';

/**
 * 请求参数
 */
interface RequestParameter extends RequestInit {
    /**
     * request url
     */
    url: string;
}

/**
 * 请求
 */
class HttpRequest extends Request implements HttpServletRequest {
    /** 请求资源路径 */
    private requestURI: string;

    /** 客户端IP地址 */
    private remoteHost: string;

    /** 服务器主机名 */
    private serverName: string;

    /** 请求参数 */
    private parameters: Map<string, string[]>;

    /** 域数据 */
    private attributes = new Map<string, any>();

    /**
     * @param param 请求构建参数
     */
    constructor(param: HttpRequest | RequestParameter) {
        let input: RequestInfo;
        let init: RequestInit | undefined;
        if (param instanceof HttpRequest) {
            input = param;
        } else {
            input = param.url;
            init = param;
        }
        super(input, init);
        const parseURL = new URL(this.url);
        this.requestURI = parseURL.pathname;
        this.remoteHost = <string>this.headers.get('x-client-ip');
        this.serverName = <string>this.headers.get('host');
        this.parameters = this.resolveParameters(parseURL.searchParams);
    }

    /**
     * 获取请求的资源路径
     */
    public getRequestURI(): string {
        return this.requestURI;
    }

    /**
     * 获取请求类型（GET、POST、PUT、DELETE和OPTIONS）
     */
    public getMethod(): string {
        return this.method;
    }

    /**
     * 获取内容类型
     */
    public getContentType(): string | undefined {
        return this.getHeader('content-type');
    }

    /**
     * 获取请求头
     *
     * @param name 请求头名称
     */
    public getHeader(name: string): string | undefined {
        return this.headers.get(name) || undefined;
    }

    /**
     * 获取客户端的IP地址
     */
    public getRemoteHost(): string {
        return this.remoteHost;
    }

    /**
     * 获取服务器主机名
     */
    public getServerName(): string {
        return this.serverName;
    }

    /**
     * 获取请求的参数
     *
     * @param name 请求参数名称
     */
    public getParameter(name: string): string | undefined {
        return this.parameters.get(name)?.[0];
    }

    /**
     * 获取请求的参数（多个值的时候使用）
     *
     * @param name 请求参数名称
     */
    public getParameterValues(name: string): string[] | undefined {
        return this.parameters.get(name);
    }

    /**
     * 获取请求体Base64
     */
    public getBody(): string | undefined {
        return this.body?.read().toString() || undefined;
    }

    /**
     * 获取域数据
     */
    public getAttribute(key: string): any {
        return this.attributes.get(key);
    }

    /**
     * 设置域数据
     */
    public setAttribute(key: string, value: any): void {
        this.attributes.set(key, value);
    }

    /**
     * 解析处理请求参数
     *
     * @param searchParams 查询参数
     */
    private resolveParameters(searchParams: URLSearchParams): Map<string, Array<string>> {
        const parameterMap = new Map<string, Array<string>>();
        for (const [key, value] of searchParams.entries()) {
            let valueArray = parameterMap.get(key);
            if (!valueArray) {
                valueArray = new Array<string>();
                parameterMap.set(key, valueArray);
            }
            valueArray.push(value);
        }
        return parameterMap;
    }
}

export default HttpRequest;
export { RequestParameter };
