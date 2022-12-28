import PathMatcher from '../../../common/utils/PathMatcher';
import HandlerInterceptor from '../HandlerInterceptor';

/**
 * 拦截器记录
 */
class InterceptorRegistration {
    /** 拦截器 */
    private interceptor: HandlerInterceptor;

    /** 拦截路径 */
    private includePatterns: Array<string> | undefined;

    /** 排除拦截路径 */
    private excludePatterns: Array<string> | undefined;

    /** 顺序序号 */
    private order = 0;

    /**
     * @param interceptor 拦截器
     */
    constructor(interceptor: HandlerInterceptor) {
        this.interceptor = interceptor;
    }

    /**
     * 拦截路径匹配
     *
     * @param path 路径
     */
    public match(path: string): boolean {
        if (this.excludePatterns && this.excludePatterns.length > 0) {
            for (const patterns of this.excludePatterns) {
                if (PathMatcher.match(patterns, path)) {
                    return false;
                }
            }
        }
        if (this.includePatterns && this.includePatterns.length > 0) {
            for (const patterns of this.includePatterns) {
                if (PathMatcher.match(patterns, path)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 获取拦截器
     */
    public getInterceptor(): HandlerInterceptor {
        return this.interceptor;
    }

    /**
     * 添加拦截路径
     *
     * @param patterns 拦截路径
     */
    public addPathPatterns(...patterns: string[]): InterceptorRegistration {
        this.includePatterns ??= new Array<string>();
        this.includePatterns.push(...patterns);
        return this;
    }

    /**
     * 添加排除拦截路径
     *
     * @param patterns 排除拦截路径
     */
    public excludePathPatterns(...patterns: string[]): InterceptorRegistration {
        this.excludePatterns ??= new Array<string>();
        this.excludePatterns.push(...patterns);
        return this;
    }

    /**
     * 获取顺序序号
     */
    public getOrder(): number {
        return this.order;
    }

    /**
     * 设置顺序序号
     *
     * @param order 顺序序号
     */
    public setOrder(order: number): InterceptorRegistration {
        this.order = order;
        return this;
    }
}

export default InterceptorRegistration;
