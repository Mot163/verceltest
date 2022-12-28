import HandlerMethod from '../../method/HandlerMethod';
import RequestMappingInfo from '../mvc/method/RequestMappingInfo';
import MappingRegistration from './MappingRegistration';

/**
 * 匹配器
 */
class Match {
    /** 映射 */
    private mapping: RequestMappingInfo;

    /** 映射记录 */
    private registration: MappingRegistration | undefined;

    /**
     * @param mapping 映射
     * @param registration 映射记录
     */
    constructor(mapping: RequestMappingInfo, registration?: MappingRegistration) {
        this.mapping = mapping;
        this.registration = registration;
    }

    /**
     * 获取映射
     */
    public getMapping(): RequestMappingInfo {
        return this.mapping;
    }

    /** 获取Handler方法 */
    public getHandlerMethod(): HandlerMethod | undefined {
        return this.registration?.getHandlerMethod();
    }
}

export default Match;
