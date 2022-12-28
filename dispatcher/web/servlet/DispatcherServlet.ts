import AbstractApplicationContext from '../../context/context/AbstractApplicationContext';
import HttpServletRequest from './http/HttpServletRequest';
import HttpServletResponse from './http/HttpServletResponse';
import FrameworkServlet from './FrameworkServlet';
import HandlerExecutionChain from './HandlerExecutionChain';
import RequestMappingHandlerMapping from './mvc/RequestMappingHandlerMapping';
import HandlerMethod from '../method/HandlerMethod';

/**
 * 前端控制器
 */
class DispatcherServlet extends FrameworkServlet {
    /** 映射处理器 */
    private handleMapping: RequestMappingHandlerMapping;

    /**
     * @param webApplicationContext web应用容器
     */
    constructor(webApplicationContext: AbstractApplicationContext) {
        super(webApplicationContext);
        this.handleMapping = this.getHandleMapping();
    }

    /**
     * 执行服务处理
     *
     * @param request 请求对象
     * @param response 响应对象
     */
    protected doService(request: HttpServletRequest, response: HttpServletResponse): void {
        this.doDispatch(request, response);
    }

    /**
     * 执行调度
     *
     * @param request 请求对象
     * @param response 响应对象
     */
    protected doDispatch(request: HttpServletRequest, response: HttpServletResponse): void {
        // 获取处理器执行链
        const handler = this.getHandler(request);
        if (!handler) {
            response.sendError(404, `not found '${request.getRequestURI()}'`);
            return;
        }

        // 执行拦截器前置方法
        if (!handler.applyPreHandle(request, response)) {
            return;
        }

        // 执行处理方法
        this.doHandler(handler.getHandler(), request, response);

        // 执行拦截器后置方法
        handler.applyPostHandle(request, response);
    }

    /**
     * 获取处理器执行链
     *
     * @param request 请求对象
     */
    protected getHandler(request: HttpServletRequest): HandlerExecutionChain | undefined {
        return this.getHandleMapping().getHandler(request);
    }

    /**
     * 获取映射处理器
     */
    private getHandleMapping(): RequestMappingHandlerMapping {
        let handleMapping = this.handleMapping;
        if (!handleMapping) {
            handleMapping = new RequestMappingHandlerMapping(this.webApplicationContext);
        }
        return handleMapping;
    }

    /**
     * 执行处理方法
     *
     * @param handlerMethod Handler方法
     * @param request 请求对象
     * @param response 响应对象
     */
    private doHandler(handlerMethod: HandlerMethod, request: HttpServletRequest, response: HttpServletResponse): void {
        return this.getHandleMapping().invokeHandlerMethod(handlerMethod, request, response);
    }
}

export default DispatcherServlet;
