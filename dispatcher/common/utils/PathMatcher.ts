/**
 * 路径解析错误
 */
class PathParseError extends Error {
    /**
     * @param message 错误信息
     */
    constructor(message: string) {
        super(message);
        this.name = 'PathParseError';
    }
}

/**
 * 路径匹配工具类
 */
class PathMatcher {
    /** 正则表达式缓存 */
    private static regExpCache = new Map<string, { regExp: RegExp; keys?: string[] }>();

    /**
     * 判断路径是否为匹配路径
     *
     * @param path 路径
     */
    public static isPattern(path: string): boolean {
        if (!path) {
            return false;
        }
        let uriVar = false;
        for (let i = 0; i < path.length; ++i) {
            const c = path[i];
            if (c == '*' || c == '?') {
                return true;
            }
            if (c == '{') {
                uriVar = true;
            } else if (c == '}' && uriVar) {
                return true;
            }
        }
        return false;
    }

    /**
     * 匹配路径
     *
     * @param pattern 匹配路径字符串
     * @param path 路径
     */
    public static match(pattern: string, path: string): boolean {
        return PathMatcher.parseToRegExp(pattern).test(PathMatcher.normalize(path));
    }

    /**
     * 提取路径变量
     *
     * @param pattern 匹配路径字符串
     * @param path 路径
     * @param keys 变量名数组
     */
    public static extractUriTemplateVariables(
        pattern: string,
        path: string,
        keys?: string[]
    ): Map<string, string> | undefined {
        path = PathMatcher.normalize(path);
        keys = new Array<string>();
        const regExp = PathMatcher.parseToRegExp(pattern, keys);
        if (keys.length === 0) {
            return undefined;
        }
        const templateVariables = new Map<string, string>();
        const execArray = regExp.exec(path);
        if (execArray == null || execArray.length < 2) {
            return undefined;
        }
        execArray.shift();
        while (keys.length > 0) {
            templateVariables.set(<string>keys.shift(), <string>execArray.shift());
        }
        return templateVariables;
    }

    /**
     * 解析匹配字符串为正则表达式
     *
     * @param pattern 匹配路径字符串
     * @param keys 路径变量名数组
     */
    private static parseToRegExp(pattern: string, keys?: string[]): RegExp {
        if (PathMatcher.regExpCache.has(pattern)) {
            const cache = <{ regExp: RegExp; keys?: string[] }>PathMatcher.regExpCache.get(pattern);
            if (!keys) {
                return cache.regExp;
            }
            if (cache.keys) {
                keys.splice(0, keys.length);
                keys.push(...cache.keys);
                return cache.regExp;
            }
        }
        if (/\*\*.+/.test(pattern)) {
            let message = `Invalid mapping pattern detected: ${pattern}`;
            message += 'No more pattern data allowed after ** pattern element';
            throw new PathParseError(message);
        }
        let regExpString = '';
        const arr = PathMatcher.normalize(pattern).split('/').splice(1);
        keys && keys.splice(0, keys.length);
        if (arr.length > 0) {
            for (let i = 0; i < arr.length; ++i) {
                const tmp = arr[i];
                if (tmp[0] === '*') {
                    regExpString += tmp === '**' ? '/(?:.+)' : '/(?:[^/]+)';
                } else if (tmp[0] === '{') {
                    keys?.push(tmp.substring(1, tmp.length - 1));
                    regExpString += '/([^/]+)';
                } else {
                    regExpString += '/' + tmp.replace(/\?/g, '[^/]');
                }
            }
        }
        const regExp = new RegExp('^' + regExpString + '/?$');
        PathMatcher.regExpCache.set(pattern, { regExp, keys });
        return regExp;
    }

    /**
     * 路径处理（开头添上'/'，将多个并列的'/'替换为一个'/'）
     *
     * @param path 路径
     */
    private static normalize(path: string): string {
        return ('/' + path).replace(/\/+/g, '/');
    }
}

export default PathMatcher;
