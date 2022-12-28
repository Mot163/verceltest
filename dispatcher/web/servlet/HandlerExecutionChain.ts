import HttpServletRequest from './http/HttpServletRequest';
import HttpServletResponse from './http/HttpServletResponse';
import HandlerInterceptor from './HandlerInterceptor';
import HandlerMethod from '../method/HandlerMethod';

/**
 * 执行链
 */
class HandlerExecutionChain {
    /** 处理方法 */
    private handler: HandlerMethod;

    /** 拦截器列表 */
    private interceptorList: HandlerInterceptor[];

    /** 拦截器执行索引 */
    private interceptorIndex: number;

    /**
     * @param handler 处理器
     * @param interceptors 拦截器
     */
    constructor(handler: HandlerMethod, ...interceptors: HandlerInterceptor[]) {
        this.handler = handler;
        this.interceptorList = interceptors;
        this.interceptorIndex = -1;
    }

    /**
     * 获取处理方法
     */
    public getHandler(): HandlerMethod {
        return this.handler;
    }

    /**
     * 添加拦截器
     *
     * @param interceptor 拦截器
     * @param index 添加索引
     */
    public addInterceptor(interceptor: HandlerInterceptor, index?: number): void {
        if (index) {
            this.interceptorList.splice(index, 0, interceptor);
        } else {
            this.interceptorList.push(interceptor);
        }
    }

    /**
     * 添加多个拦截器
     *
     * @param interceptors 拦截器
     */
    public addInterceptors(...interceptors: HandlerInterceptor[]): void {
        this.interceptorList.push(...interceptors);
    }

    /**
     * 执行拦截器前置方法
     *
     * @param request 请求
     * @param response 响应
     */
    applyPreHandle(request: HttpServletRequest, response: HttpServletResponse): boolean {
        for (let i = 0; i < this.interceptorList.length; this.interceptorIndex = i++) {
            const interceptor = this.interceptorList[i];
            if (!interceptor.preHandle(request, response, this.handler)) {
                this.triggerAfterCompletion(request, response);
                return false;
            }
        }

        return true;
    }

    /**
     * 执行拦截器后置
     *
     * @param request 请求
     * @param response 响应
     */
    applyPostHandle(request: HttpServletRequest, response: HttpServletResponse): void {
        for (let i = this.interceptorList.length - 1; i >= 0; --i) {
            const interceptor = this.interceptorList[i];
            interceptor.postHandle(request, response, this.handler);
        }
    }

    /**
     * 执行拦截器完成前方法
     *
     * @param request 请求
     * @param response 响应
     * @param ex 错误
     */
    triggerAfterCompletion(request: HttpServletRequest, response: HttpServletResponse, ex?: Error): void {
        for (let i = this.interceptorIndex; i >= 0; --i) {
            const interceptor = this.interceptorList[i];
            interceptor.afterCompletion(request, response, this.handler, ex);
        }
    }
}

export default HandlerExecutionChain;
