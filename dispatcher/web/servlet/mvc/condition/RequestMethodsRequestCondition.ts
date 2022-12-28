import RequestMethod from '../../../annotation/RequestMethod';
import HttpServletRequest from '../../http/HttpServletRequest';

/**
 * 请求类型条件
 */
class RequestMethodsRequestCondition {
    /** 请求类型条件缓存 */
    private static requestMethodConditionCache = new Map<string, RequestMethodsRequestCondition>();

    /** 请求类型集 */
    private methods: Set<string>;

    static {
        for (const method of Object.keys(RequestMethod)) {
            const methodCondition = new RequestMethodsRequestCondition(method);
            RequestMethodsRequestCondition.requestMethodConditionCache.set(method, methodCondition);
        }
    }

    /**
     * @param methods 请求类型集
     */
    constructor(...methods: string[]) {
        this.methods = new Set<string>(methods.length > 0 ? methods : Object.keys(RequestMethod));
    }

    /**
     * 获取请求类型集
     */
    public getMethods(): Set<string> {
        return this.methods;
    }

    /**
     * 获取匹配的请求类型条件
     *
     * @param request 请求
     */
    public getMatchingCondition(request: HttpServletRequest): RequestMethodsRequestCondition | undefined {
        const httpMethod = request.getMethod();
        if (this.getMethods().has(httpMethod)) {
            return RequestMethodsRequestCondition.requestMethodConditionCache.get(httpMethod);
        }
        return undefined;
    }

    /**
     * 比较
     *
     * @param other 其他请求类型条件
     */
    public compareTo(other: RequestMethodsRequestCondition): number {
        if (this.methods.size !== other.getMethods().size) {
            return this.methods.size > other.getMethods().size ? 1 : -1;
        }
        for (const method of other.getMethods()) {
            if (!this.methods.has(method)) {
                return -1;
            }
        }
        return 0;
    }
}

export default RequestMethodsRequestCondition;
