import HandlerMethod from '../../method/HandlerMethod';
import RequestMappingInfo from '../mvc/method/RequestMappingInfo';
import RequestMappingHandlerMapping from '../mvc/RequestMappingHandlerMapping';
import MappingRegistration from './MappingRegistration';

/**
 * 映射注册器
 */
class MappingRegistry {
    /** 请求映射处理器 */
    private handlerMapping: RequestMappingHandlerMapping;

    /** 请求映射信息与映射记录映射集 */
    private registry = new Map<RequestMappingInfo, MappingRegistration>();

    /** 路径与请求映射信息映射集 */
    private pathLookup = new Map<String, RequestMappingInfo[]>();

    /** 映射名称与Handler方法映射集 */
    private nameLookup = new Map<String, HandlerMethod[]>();

    /**
     * @param handlerMapping 映射处理器
     */
    constructor(handlerMapping: RequestMappingHandlerMapping) {
        this.handlerMapping = handlerMapping;
    }

    /**
     * 获取请求映射信息与映射记录映射集
     */
    public getRegistrations(): Map<RequestMappingInfo, MappingRegistration> {
        return this.registry;
    }

    /**
     * 通过路径获取请求映射信息列表
     *
     * @param urlPath 路径
     */
    public getMappingsByDirectPath(urlPath: string): RequestMappingInfo[] | undefined {
        return this.pathLookup.get(urlPath);
    }

    /**
     * 通过映射名称获取Handler方法列表
     *
     * @param mappingName 映射名称
     */
    public getHandlerMethodsByMappingName(mappingName: string): HandlerMethod[] | undefined {
        return this.nameLookup.get(mappingName);
    }

    /**
     * 注册
     *
     * @param info 映射信息
     * @param handler 处理器
     * @param method 方法 或 方法名
     */
    public register(info: RequestMappingInfo, handler: Object, method: Function | string): void {
        const handlerMethod = this.handlerMapping.createHandlerMethod(handler, method);
        this.validateMethodMapping(handlerMethod, info);
        const directPaths = info.getDirectPaths();
        for (const path of directPaths) {
            let infos = this.pathLookup.get(path);
            if (!infos) {
                infos = new Array<RequestMappingInfo>();
                this.pathLookup.set(path, infos);
            }
            infos.push(info);
        }
        this.addMappingName(info.getName(), handlerMethod);
        this.registry.set(info, new MappingRegistration(info, handlerMethod, directPaths));
    }

    /**
     * 校验方法映射
     *
     * @param handlerMethod Handler方法
     * @param info 映射信息
     */
    private validateMethodMapping(handlerMethod: HandlerMethod, info: RequestMappingInfo): void {
        const registration = this.registryGet(info);
        const existingHandlerMethod = registration ? registration.getHandlerMethod() : undefined;
        if (existingHandlerMethod && existingHandlerMethod.compareTo(handlerMethod) === 0) {
            let message = `Ambiguous mapping. Cannot map '${handlerMethod.getBean()}' method\n`;
            message += handlerMethod + '\n';
            message += `to ${info}: There is already '${existingHandlerMethod.getBean()}' bean method\n`;
            message += `${existingHandlerMethod} mapped.`;
            throw new Error(message);
        }
    }

    /**
     * 映射名称与Handler方法映射集添加元素
     *
     * @param name 映射名称
     * @param handlerMethod Handler方法
     */
    private addMappingName(name: string, handlerMethod: HandlerMethod): void {
        const list = this.nameLookup.get(name) || [];
        if (!list.includes(handlerMethod)) {
            list.push(handlerMethod);
        }
        this.nameLookup.set(name, list);
    }

    /**
     * 注销
     *
     * @param info 请求映射信息
     */
    public unregister(info: RequestMappingInfo): void {
        const registration = this.registryGet(info);
        if (registration) {
            this.registryDelete(info);
            const directPaths = registration.getDirectPaths();
            for (const path of directPaths) {
                const infos = this.pathLookup.get(path);
                if (infos) {
                    const index = infos.findIndex((item) => item.compareTo(registration.getMapping()) === 0);
                    infos.splice(index, 1);
                    if (infos.length === 0) {
                        this.pathLookup.delete(path);
                    }
                }
            }
            this.removeMappingName(registration);
        }
    }

    /**
     * 请求映射信息与映射记录映射集自定义比较 get 方法
     *
     * @param info 请求映射信息
     */
    public registryGet(info: RequestMappingInfo): MappingRegistration | undefined {
        const key = Array.from(this.registry.keys()).find((key) => key.compareTo(info) === 0);
        return key ? this.registry.get(key) : undefined;
    }

    /**
     * 请求映射信息与映射记录映射集自定义比较 delete 方法
     *
     * @param info 请求映射信息
     */
    public registryDelete(info: RequestMappingInfo): boolean {
        const key = Array.from(this.registry.keys()).find((key) => key.compareTo(info) === 0);
        if (!key) {
            return true;
        }
        return this.registry.delete(key);
    }

    /**
     * 删除映射记录集对应注册记录
     *
     * @param registration 注册记录
     */
    private removeMappingName(registration: MappingRegistration): void {
        const name = registration.getMappingName();
        if (name) {
            const list = this.nameLookup.get(name);
            if (list) {
                if (list.length <= 1) {
                    this.nameLookup.delete(name);
                } else {
                    const handlerMethod = registration.getHandlerMethod();
                    const index = list.findIndex((item) => item.compareTo(handlerMethod) === 0);
                    list.splice(index, 1);
                }
            }
        }
    }
}

export default MappingRegistry;
