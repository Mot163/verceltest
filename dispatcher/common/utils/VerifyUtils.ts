/**
 * 校验工具类
 */
class VerifyUtils {
    /**
     * 检查 value 是否是 null 或 undefined
     *
     * @param value 被校验值
     */
    public static isNil(value: any): boolean {
        return value == null;
    }

    /**
     * 检查 value 是否非 null 和 undefined
     *
     * @param value 被校验值
     */
    public static isNotNil(value: any): boolean {
        return !VerifyUtils.isNil(value);
    }

    /**
     * 检查 value 是否是 string
     *
     * @param value 被校验值
     */
    public static isString(value: any): boolean {
        return typeof value === 'string';
    }

    /**
     * 检查 value 是否非 string
     *
     * @param value 被校验值
     */
    public static isNotString(value: any): boolean {
        return !VerifyUtils.isString(value);
    }

    /**
     * 检查 value 是否是 function
     *
     * @param value 被校验值
     */
    public static isFunction(value: any): boolean {
        return typeof value === 'function' && !/^class/.test(value.toString());
    }

    /**
     * 检查 value 是否非 function
     *
     * @param value 被校验值
     */
    public static isNotFunction(value: any): boolean {
        return !VerifyUtils.isFunction(value);
    }

    /**
     * 检查 value 是否等于 other
     *
     * @param param 被校验参数对象
     * @param param.value 参与校验的第一个值
     * @param param.other 参与校验的第二个值
     */
    public static isEqual<T>({ value, other }: { value: T; other: T }): boolean {
        if (value === other) {
            return true;
        }
        if (typeof value !== 'object') {
            return Object.is(value, other);
        }
        const valueKeys = Object.keys(<Object>value);
        const otherKeys = Object.keys(<Object>other);
        if (valueKeys.length !== otherKeys.length) {
            return false;
        }
        for (let i = 0; i < valueKeys.length; ++i) {
            if (VerifyUtils.isNotEqual({ value: valueKeys[i], other: otherKeys[i] })) {
                return false;
            }
        }
        return true;
    }

    /**
     * 检查 value 是否不等于 other
     *
     * @param param 被校验参数对象
     * @param param.value 参与校验的第一个值
     * @param param.other 参与校验的第二个值
     */
    public static isNotEqual<T>({ value, other }: { value: T; other: T }): boolean {
        return !VerifyUtils.isEqual({ value, other });
    }
}

export default VerifyUtils;
