import AbstractApplicationContext from '../../context/context/AbstractApplicationContext';
import RequestMethod from '../annotation/RequestMethod';
import HttpServlet from './http/HttpServlet';
import HttpServletRequest from './http/HttpServletRequest';
import HttpServletResponse from './http/HttpServletResponse';

/**
 * 框架Servlet
 */
abstract class FrameworkServlet extends HttpServlet {
    /** web应用容器 */
    protected webApplicationContext: AbstractApplicationContext;

    /**
     * @param webApplicationContext web应用容器
     */
    constructor(webApplicationContext: AbstractApplicationContext) {
        super();
        this.webApplicationContext = webApplicationContext;
    }

    /**
     * 服务处理
     *
     * @param request 请求对象
     * @param response 响应对象
     */
    public service(request: HttpServletRequest, response: HttpServletResponse): void {
        const httpMethod = request.getMethod();
        if (httpMethod !== RequestMethod.PATCH && !httpMethod) {
            super.service(request, response);
        } else {
            this.processRequest(request, response);
        }
    }

    /**
     * GET请求处理
     *
     * @param request 请求对象
     * @param response 响应对象
     */
    protected doGet(request: HttpServletRequest, response: HttpServletResponse): void {
        this.processRequest(request, response);
    }

    /**
     * POST请求处理
     *
     * @param request 请求对象
     * @param response 响应对象
     */
    protected doPost(request: HttpServletRequest, response: HttpServletResponse): void {
        this.processRequest(request, response);
    }

    /**
     * PUT请求处理
     *
     * @param request 请求对象
     * @param response 响应对象
     */
    protected doPut(request: HttpServletRequest, response: HttpServletResponse): void {
        this.processRequest(request, response);
    }

    /**
     * DELETE请求处理
     *
     * @param request 请求对象
     * @param response 响应对象
     */
    protected doDelete(request: HttpServletRequest, response: HttpServletResponse): void {
        this.processRequest(request, response);
    }

    /**
     * OPTIONS请求处理
     *
     * @param request 请求对象
     * @param response 响应对象
     */
    protected doOptions(request: HttpServletRequest, response: HttpServletResponse): void {
        let value = response.getHeader('Allow');
        if (value) {
            value += `, ${RequestMethod.PATCH}`;
        } else {
            value = RequestMethod.PATCH;
        }
        response.setHeader('Allow', value);
    }

    /**
     * 请求处理
     *
     * @param request 请求对象
     * @param response 响应对象
     */
    protected processRequest(request: HttpServletRequest, response: HttpServletResponse): void {
        this.doService(request, response);
    }

    /**
     * 执行服务处理
     *
     * @param request 请求对象
     * @param response 响应对象
     */
    protected abstract doService(request: HttpServletRequest, response: HttpServletResponse): void;
}

export default FrameworkServlet;
