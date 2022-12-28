import PathUtils from './common/utils/PathUtils';
import StackUtils from './common/utils/StackUtils';
import GenericApplicationContext from './context/context/support/GenericApplicationContext';
import { HttpRequest, RequestParameter, HttpResponse, ResponseParameter } from './HttpWrapper';
import DispatcherServlet from './web/servlet/DispatcherServlet';

/** 服务方法 */
type ServiceFunction = (
    /** 请求 */ request: HttpRequest | RequestParameter,
    /** 响应 */ response?: HttpResponse | ResponseParameter
) => HttpResponse;

/**
 * Web应用
 */
class WebApplication {
    /**
     * 启动
     *
     * @param basePath 基础路径
     */
    public static async run(basePath?: string): Promise<ServiceFunction> {
        if (!basePath) {
            // 获取默认基础路径（调用run方法的文件所在目录）
            const stackFileNameList = StackUtils.getStackFileNameList().filter((item) => item != null);
            const index = stackFileNameList.findIndex((item) => item !== stackFileNameList[0]);
            basePath = PathUtils.getDirnameByURL(stackFileNameList[index]);
        }
        // 创建应用容器
        const context = new GenericApplicationContext();
        context.setBasePath(basePath);
        await context.refresh();
        // 创建前端控制器
        const dispatcherServlet = new DispatcherServlet(context);
        // 返回服务方法
        return (req: HttpRequest | RequestParameter, res?: HttpResponse | ResponseParameter) => {
            const request = req instanceof HttpRequest ? req : new HttpRequest(req);
            const response = res instanceof HttpResponse ? res : new HttpResponse(res);
            dispatcherServlet.service(request, response);
            return response;
        };
    }
}

export default WebApplication;
