import PathMatcher from '../../../../common/utils/PathMatcher';
import HttpServletRequest from '../../http/HttpServletRequest';
import PatternsRequestCondition from '../condition/PatternsRequestCondition';
import RequestMethodsRequestCondition from '../condition/RequestMethodsRequestCondition';

/**
 * 请求映射信息
 */
class RequestMappingInfo {
    /** 映射名称 */
    private name: string;

    /** 路径匹配条件 */
    private patternsCondition: PatternsRequestCondition;

    /** 请求类型条件 */
    private methodsCondition: RequestMethodsRequestCondition;

    /**
     * @param name 映射名称
     * @param patternsCondition 路径匹配条件
     * @param methodsCondition 请求类型条件
     */
    constructor(
        name: string,
        patternsCondition: PatternsRequestCondition,
        methodsCondition: RequestMethodsRequestCondition
    ) {
        this.name = name;
        this.patternsCondition = patternsCondition;
        this.methodsCondition = methodsCondition;
    }

    /**
     * 获取映射名称
     */
    public getName(): string {
        return this.name;
    }

    /**
     * 获取请求类型条件
     */
    public getPatternsCondition(): PatternsRequestCondition {
        return this.patternsCondition;
    }

    /**
     * 获取请求类型条件
     */
    public getMethodsCondition(): RequestMethodsRequestCondition {
        return this.methodsCondition;
    }

    /**
     * 获取直接路径集
     */
    public getDirectPaths(): Set<string> {
        const directPaths = new Set<string>();
        for (const pattern of this.patternsCondition.getPatterns()) {
            if (!PathMatcher.isPattern(pattern)) {
                directPaths.add(pattern);
            }
        }
        return directPaths;
    }

    /**
     * 获取匹配路径集
     */
    public getPatternValues(): Set<string> {
        const patternValues = new Set<string>();
        for (const pattern of this.patternsCondition.getPatterns()) {
            if (PathMatcher.isPattern(pattern)) {
                patternValues.add(pattern);
            }
        }
        return patternValues;
    }

    /**
     * 获取匹配的映射
     *
     * @param request 请求
     */
    public getMatchingCondition(request: HttpServletRequest): RequestMappingInfo | undefined {
        const methods = this.methodsCondition.getMatchingCondition(request);
        if (!methods) {
            return undefined;
        }
        const patterns = this.patternsCondition.getMatchingCondition(request);
        if (!patterns) {
            return undefined;
        }
        return new RequestMappingInfo(this.name, patterns, methods);
    }

    /**
     * 比较
     *
     * @param other 映射信息
     */
    public compareTo(other: RequestMappingInfo): number {
        let result = this.methodsCondition.compareTo(other.getMethodsCondition());
        if (result !== 0) {
            return result;
        }
        result = this.patternsCondition.compareTo(other.getPatternsCondition());
        return result !== 0 ? result : 0;
    }
}

export default RequestMappingInfo;
