import BeanFactory from '../../../beans/BeanFactory';
import DecoratorUtils from '../../../common/utils/DecoratorUtils';
import DecoratorType from '../../../common/enum/DecoratorType';
import AbstractApplicationContext from '../../../context/context/AbstractApplicationContext';
import Controller from '../../../context/stereotype/Controller';
import IRequestMapping from '../../annotation/interface/IRequestMapping';
import RequestMapping from '../../annotation/RequestMapping';
import HttpServletRequest from '../http/HttpServletRequest';
import HttpServletResponse from '../http/HttpServletResponse';
import HandlerMethod from '../../method/HandlerMethod';
import MappingRegistry from '../handler/MappingRegistry';
import Match from '../handler/Match';
import HandlerExecutionChain from '../HandlerExecutionChain';
import HandlerInterceptor from '../HandlerInterceptor';
import PatternsRequestCondition from './condition/PatternsRequestCondition';
import RequestMethodsRequestCondition from './condition/RequestMethodsRequestCondition';
import RequestMappingInfo from './method/RequestMappingInfo';
import InterceptorRegistry from '../config/InterceptorRegistry';
import WebMvcConfigurationSupport from '../config/WebMvcConfigurationSupport';
import PathVariable from '../../annotation/PathVariable';
import PathMatcher from '../../../common/utils/PathMatcher';
import RequestParam from '../../annotation/RequestParam';
import RequestBody from '../../annotation/RequestBody';

/**
 * 请求处理器映射
 */
class RequestMappingHandlerMapping {
    /** 匹配路径属性名 */
    private static MATCH_PATTERN = '__match_pattern__';

    /** 映射注册器 */
    private mappingRegistry: MappingRegistry;

    /** 拦截器注册器 */
    private interceptorRegistry: InterceptorRegistry;

    /**
     * @param context 应用容器
     */
    constructor(context: AbstractApplicationContext) {
        this.mappingRegistry = new MappingRegistry(this);
        this.interceptorRegistry = new InterceptorRegistry();
        this.initHandlerMethods(context);
        this.initHandlerInterceptors(context);
    }

    /**
     * 初始化Handler方法
     *
     * @param context 应用容器
     */
    public initHandlerMethods(context: AbstractApplicationContext): void {
        const beanNames = context.getBeanFactory().getBeanNamesForAnnotation(Controller);
        for (const beanName of beanNames) {
            const handler = context.getBean(beanName);
            const prototype = Object.getPrototypeOf(handler);
            const handlerDecorator = DecoratorUtils.getDecorator(prototype, RequestMapping)[0];
            const methodDecorators = DecoratorUtils.getDecorator(prototype, RequestMapping, DecoratorType.METHOD);
            for (const methodDecorator of methodDecorators) {
                const info = this.createRequestMappingInfo(handler, handlerDecorator, methodDecorator);
                if (info) {
                    this.mappingRegistry.register(info, handler, <string>methodDecorator.metadata.methodName);
                }
            }
        }
    }

    /**
     * 初始化拦截器
     *
     * @param context 应用容器
     */
    public initHandlerInterceptors(context: AbstractApplicationContext): void {
        const beans = context.getBeanFactory().getBeansOfType(WebMvcConfigurationSupport);
        beans[0] && (<WebMvcConfigurationSupport>beans[0]).addInterceptors(this.interceptorRegistry);
    }

    /**
     * 获取处理器执行链
     *
     * @param request 请求
     */
    public getHandler(request: HttpServletRequest): HandlerExecutionChain | undefined {
        let handler = this.lookupHandlerMethod(request);
        if (!handler) {
            return undefined;
        }
        const interceptors = this.interceptorRegistry.getMappingsInterceptors(request.getRequestURI());
        return this.getHandlerExecutionChain(handler, interceptors);
    }

    /**
     * 调用处理方法
     *
     * @param request 请求
     * @param response 响应
     * @param handlerMethod 处理方法
     */
    public invokeHandlerMethod(
        handlerMethod: HandlerMethod,
        request: HttpServletRequest,
        response: HttpServletResponse
    ): void {
        const controller = handlerMethod.getBean();
        const method = handlerMethod.getMethod();
        const parameters = new Array<any>();
        const maxIndex = handlerMethod.getMaxIndex();
        if (maxIndex !== -1) {
            parameters.length = maxIndex + 1;
            const methodParameters = handlerMethod.getMethodParameters();
            for (const methodParameter of methodParameters) {
                let value;
                if (methodParameter.decorator instanceof PathVariable) {
                    const pattern = request.getAttribute(RequestMappingHandlerMapping.MATCH_PATTERN);
                    const path = request.getRequestURI();
                    const map = PathMatcher.extractUriTemplateVariables(pattern, path);
                    value = map?.get(methodParameter.name);
                } else if (methodParameter.decorator instanceof RequestParam) {
                    value = request.getParameter(methodParameter.name);
                } else if (methodParameter.decorator instanceof RequestBody) {
                    const contentType = request.getContentType();
                    if (!contentType || !contentType.startsWith('application/json')) {
                        throw new TypeError(`content type '${contentType}' not supported`);
                    }
                    const body = request.getBody()?.toString();
                    value = body ? JSON.parse(body) : {};
                }
                parameters[methodParameter.index] = value;
            }
        }
        parameters.push({ request, response });
        const result = method.apply(controller, parameters);
        if (result) {
            const isText = typeof result === 'string';
            response.setContentType(isText ? 'text/plain' : 'application/json');
            response.setBody(isText ? result : JSON.stringify(result));
        }
    }

    /**
     * 创建请求映射信息
     *
     * @param handler 处理器
     * @param handlerDecorator 处理器请求装饰器
     * @param methodDecorator 方法请求装饰器
     */
    public createRequestMappingInfo(
        handler: Object,
        handlerDecorator: IRequestMapping | undefined,
        methodDecorator: IRequestMapping
    ): RequestMappingInfo | undefined {
        const methods = this.intersectHttpMethod(
            handlerDecorator?.metadata.httpMethod,
            methodDecorator.metadata.httpMethod
        );
        if (!methods) {
            return undefined;
        }
        const methodsCondition = new RequestMethodsRequestCondition(...methods);
        const patterns = this.combinePath(handlerDecorator?.metadata.path, methodDecorator.metadata.path);
        const patternsCondition = new PatternsRequestCondition(...patterns);
        const name = this.getName(handler, <string>methodDecorator.metadata.methodName);
        return new RequestMappingInfo(name, patternsCondition, methodsCondition);
    }

    /**
     * 创建Handler方法
     *
     * @param handler 处理器
     * @param method 方法 或 方法名称
     */
    public createHandlerMethod(handler: Object, method: Function | string, beanFactory?: BeanFactory): HandlerMethod {
        return new HandlerMethod(handler, method, beanFactory);
    }

    /**
     * 获取处理器执行链
     *
     * @param handler 处理器
     * @param interceptors 拦截器列表
     */
    protected getHandlerExecutionChain(
        handler: HandlerMethod,
        interceptors: HandlerInterceptor[]
    ): HandlerExecutionChain {
        return new HandlerExecutionChain(handler, ...interceptors);
    }

    /**
     * 查询Handler方法
     *
     * @param request 请求
     */
    protected lookupHandlerMethod(request: HttpServletRequest): HandlerMethod | undefined {
        const lookupPath = request.getRequestURI();
        const matches = new Array<Match>();
        const directPathMatches = this.mappingRegistry.getMappingsByDirectPath(lookupPath);
        if (directPathMatches) {
            this.addMatchingMappings(directPathMatches, matches, request);
        }
        if (matches.length === 0) {
            const infos = Array.from(this.mappingRegistry.getRegistrations().keys());
            this.addMatchingMappings(infos, matches, request);
        }
        if (matches.length === 0) {
            return undefined;
        }
        const bestMatch = matches[0];
        if (matches.length > 1) {
            const secondBestMatch = matches[1];
            if (bestMatch.getMapping().compareTo(secondBestMatch.getMapping()) === 0) {
                const m1 = bestMatch.getHandlerMethod()?.getMethod();
                const m2 = secondBestMatch.getHandlerMethod()?.getMethod();
                const uri = request.getRequestURI();
                throw new Error(`Ambiguous handler methods mapped for '${uri}': {${m1}, ${m2}}`);
            }
        }
        const matchPattern = bestMatch.getMapping().getPatternsCondition().getPatterns().values().next().value;
        request.setAttribute(RequestMappingHandlerMapping.MATCH_PATTERN, matchPattern);
        return bestMatch.getHandlerMethod();
    }

    /**
     * 获取映射名称
     *
     * @param handler 处理器
     * @param method 方法 或 方法名称
     */
    private getName(handler: Object, method: Function | string): string {
        let sb = '';
        const type = Object.getPrototypeOf(handler).constructor;
        const simpleTypeName = type.name;
        for (let i = 0; i < simpleTypeName.length; ++i) {
            if (simpleTypeName[i].toUpperCase() === simpleTypeName[i]) {
                sb += simpleTypeName[i];
            }
        }
        sb += '#' + (typeof method === 'string' ? method : method.name);
        return sb;
    }

    /**
     * 合并路径
     *
     * @param parentPaths 父路径
     * @param childPaths 子路径
     */
    private combinePath(parentPaths: string[] | undefined, childPaths: string[]): string[] {
        if (!parentPaths || parentPaths.length === 0) {
            return childPaths;
        }
        const combinePaths = new Array<string>();
        for (const parentPath of parentPaths) {
            for (const childPath of childPaths) {
                combinePaths.push(`/${parentPath}/${childPath}`.replace(/\/+/g, '/'));
            }
        }
        return combinePaths;
    }

    /**
     * 合并请求类型
     *
     * @param parentMethods 父请求类型
     * @param childMethods 子请求类型
     * @returns 空数组: 可以匹配全部请求类型, undefined: 没有匹配的请求类型
     */
    private intersectHttpMethod(
        parentMethods: string[] | undefined,
        childMethods: string[] | undefined
    ): string[] | undefined {
        if (!parentMethods || parentMethods.length === 0) {
            return childMethods || [];
        }
        if (!childMethods || childMethods.length === 0) {
            return parentMethods || [];
        }
        const intersectMethods = new Array<string>();
        for (const childMethod of childMethods) {
            if (parentMethods.includes(childMethod)) {
                intersectMethods.push(childMethod);
            }
        }
        return intersectMethods.length > 0 ? intersectMethods : undefined;
    }

    /**
     * 添加匹配的映射
     *
     * @param infos 请求映射信息列表
     * @param matches 匹配器列表
     * @param request 请求
     */
    private addMatchingMappings(infos: RequestMappingInfo[], matches: Match[], request: HttpServletRequest): void {
        for (const info of infos) {
            const match = info.getMatchingCondition(request);
            if (match) {
                matches.push(new Match(match, this.mappingRegistry.registryGet(info)));
            }
        }
    }
}

export default RequestMappingHandlerMapping;
