import HandlerMethod from '../../method/HandlerMethod';
import RequestMappingInfo from '../mvc/method/RequestMappingInfo';

/**
 * 映射记录
 */
class MappingRegistration {
    /** 映射名称 */
    private mappingName: string;

    /** 映射 */
    private mapping: RequestMappingInfo;

    /** Handler方法 */
    private handlerMethod: HandlerMethod;

    /** 映射路径 */
    private directPaths: Set<string>;

    /**
     * @param info 请求映射信息
     * @param handlerMethod Handler方法
     * @param directPaths 映射路径
     */
    constructor(info: RequestMappingInfo, handlerMethod: HandlerMethod, directPaths?: Set<string>) {
        this.mapping = info;
        this.handlerMethod = handlerMethod;
        this.directPaths = directPaths || new Set<string>();
        this.mappingName = info.getName();
    }

    /**
     * 获取映射名称
     */
    public getMappingName(): string {
        return this.mappingName;
    }

    /**
     * 获取映射
     */
    public getMapping(): RequestMappingInfo {
        return this.mapping;
    }

    /**
     * 获取Handler方法
     */
    public getHandlerMethod(): HandlerMethod {
        return this.handlerMethod;
    }

    /**
     * 获取映射路径
     */
    public getDirectPaths(): Set<string> {
        return this.directPaths;
    }
}

export default MappingRegistration;
