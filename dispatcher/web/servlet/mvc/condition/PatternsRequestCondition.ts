import PathMatcher from '../../../../common/utils/PathMatcher';
import HttpServletRequest from '../../http/HttpServletRequest';

/**
 * 路径匹配条件
 */
class PatternsRequestCondition {
    /** 匹配路径集 */
    private patterns: Set<string>;

    /**
     * @param patterns 匹配路径
     */
    constructor(...patterns: string[]) {
        this.patterns = new Set<string>(patterns);
    }

    /**
     * 获取匹配路径集
     */
    public getPatterns(): Set<string> {
        return this.patterns;
    }

    /**
     * 获取匹配的路径条件
     *
     * @param request 请求
     */
    public getMatchingCondition(request: HttpServletRequest): PatternsRequestCondition | undefined {
        const lookupPath = request.getRequestURI();
        const matches = this.getMatchingPatterns(lookupPath);
        return matches.length > 0 ? new PatternsRequestCondition(...matches) : undefined;
    }

    /**
     * 获取匹配的路径列表
     *
     * @param lookupPath 请求路径
     */
    public getMatchingPatterns(lookupPath: string): string[] {
        const matches = new Array<string>();
        for (const pattern of this.patterns) {
            const match = this.getMatchingPattern(pattern, lookupPath);
            if (match) {
                matches.push(match);
            }
        }
        if (matches.length > 1) {
            return matches.sort();
        }
        return matches;
    }

    /**
     * 匹配路径
     */
    private getMatchingPattern(pattern: string, lookupPath: string): string | undefined {
        if (PathMatcher.isPattern(pattern)) {
            return PathMatcher.match(pattern, lookupPath) ? pattern : undefined;
        }
        return pattern === lookupPath ? pattern : undefined;
    }

    /**
     * 比较
     *
     * @param other 其他路径匹配条件
     */
    public compareTo(other: PatternsRequestCondition): number {
        if (this.patterns.size !== other.getPatterns().size) {
            return this.patterns.size > other.getPatterns().size ? -1 : 1;
        }
        for (const pattern of other.getPatterns()) {
            if (!this.patterns.has(pattern)) {
                return -1;
            }
        }
        return 0;
    }
}

export default PatternsRequestCondition;
