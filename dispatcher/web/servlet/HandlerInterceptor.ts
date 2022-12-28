import HandlerMethod from '../method/HandlerMethod';
import HttpServletRequest from './http/HttpServletRequest';
import HttpServletResponse from './http/HttpServletResponse';

/**
 * 拦截器
 */
abstract class HandlerInterceptor {
    /**
     * 拦截器前置方法
     *
     * @param request 请求
     * @param response 响应
     * @param handlerMethod 处理方法
     */
    public preHandle(
        request: HttpServletRequest,
        response: HttpServletResponse,
        handlerMethod: HandlerMethod
    ): boolean {
        return true;
    }

    /**
     * 拦截器后置方法
     *
     * @param request 请求
     * @param response 响应
     * @param handlerMethod 处理方法
     */
    public postHandle(request: HttpServletRequest, response: HttpServletResponse, handlerMethod: HandlerMethod): void {}

    /**
     * 拦截器完成前方法
     *
     * @param request 请求
     * @param response 响应
     * @param handlerMethod 处理方法
     * @param ex 错误
     */
    public afterCompletion(
        request: HttpServletRequest,
        response: HttpServletResponse,
        handlerMethod: HandlerMethod,
        ex?: Error
    ): void {}
}

export default HandlerInterceptor;
