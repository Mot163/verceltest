import RequestMethod from '../../annotation/RequestMethod';
import HttpServletRequest from './HttpServletRequest';
import HttpServletResponse from './HttpServletResponse';

/**
 * HTTP Servlet
 */
abstract class HttpServlet {
    /**
     * 服务处理
     *
     * @param request 请求对象
     * @param response 响应对象
     */
    protected service(request: HttpServletRequest, response: HttpServletResponse): void {
        const httpMethod = request.getMethod();
        if (httpMethod === RequestMethod.GET) {
            this.doGet(request, response);
        } else if (httpMethod === RequestMethod.POST) {
            this.doPost(request, response);
        } else if (httpMethod === RequestMethod.PUT) {
            this.doPut(request, response);
        } else if (httpMethod === RequestMethod.DELETE) {
            this.doDelete(request, response);
        } else if (httpMethod === RequestMethod.OPTIONS) {
            this.doOptions(request, response);
        } else {
            response.sendError(501, `http.method_not_implemented [${httpMethod}]`);
        }
    }

    /**
     * GET请求处理
     *
     * @param request 请求对象
     * @param response 响应对象
     */
    protected abstract doGet(request: HttpServletRequest, response: HttpServletResponse): void;

    /**
     * POST请求处理
     *
     * @param request 请求对象
     * @param response 响应对象
     */
    protected abstract doPost(request: HttpServletRequest, response: HttpServletResponse): void;

    /**
     * PUT请求处理
     *
     * @param request 请求对象
     * @param response 响应对象
     */
    protected abstract doPut(request: HttpServletRequest, response: HttpServletResponse): void;

    /**
     * DELETE请求处理
     *
     * @param request 请求对象
     * @param response 响应对象
     */
    protected abstract doDelete(request: HttpServletRequest, response: HttpServletResponse): void;

    /**
     * OPTIONS请求处理
     *
     * @param request 请求对象
     * @param response 响应对象
     */
    protected abstract doOptions(request: HttpServletRequest, response: HttpServletResponse): void;
}

export default HttpServlet;
