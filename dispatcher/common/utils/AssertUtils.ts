import VerifyUtils from './VerifyUtils';

/** 校验函数 */
type VerifyFunction<T> = (/** 被校验值 */ value: T) => boolean;
/** 错误函数 */
type ErrorFunction = () => Error;

/**
 * 断言错误
 */
class AssertError extends Error {
    /**
     * @param message 断言错误信息
     */
    constructor(message: string) {
        super(message);
        this.name = 'AssertError';
    }

    /**
     * 创建错误函数
     *
     * @param message 断言错误信息
     */
    public static createErrorFunction(message: string): ErrorFunction {
        return () => new AssertError(message);
    }
}

/**
 * 断言工具类
 */
class AssertUtils {
    /**
     * 断言
     *
     * @param object 断言对象
     * @param verifier 检验器
     * @param error 断言错误
     */
    public static isTrue<T>(object: T, verifier: VerifyFunction<T>, error: ErrorFunction): void {
        if (!verifier(object)) {
            throw error();
        }
    }

    /**
     * 断言 object 是 null 或 undefined
     *
     * @param object 断言对象
     * @param message 断言错误信息
     */
    public static isNil(object: any, message?: string): void {
        return AssertUtils.isTrue(
            object,
            VerifyUtils.isNil,
            AssertError.createErrorFunction(message || `'${object}' is neither null nor undefined`)
        );
    }

    /**
     * 断言 object 非 null 和 undefined
     *
     * @param object 断言对象
     * @param message 断言错误信息
     */
    public static isNotNil(object: any, message?: string): void {
        return AssertUtils.isTrue(
            object,
            VerifyUtils.isNotNil,
            AssertError.createErrorFunction(message || `'${object}' is neither null nor undefined`)
        );
    }

    /**
     * 断言 object 是 function
     *
     * @param object 断言对象
     * @param message 断言错误信息
     */
    public static isFunction(object: any, message?: string): void {
        return AssertUtils.isTrue(
            object,
            VerifyUtils.isFunction,
            AssertError.createErrorFunction(message || `'${object}' is not function`)
        );
    }

    /**
     * 断言 object 非 function
     *
     * @param object 断言对象
     * @param message 断言错误信息
     */
    public static isNotFunction(object: any, message?: string): void {
        return AssertUtils.isTrue(
            object,
            VerifyUtils.isNotFunction,
            AssertError.createErrorFunction(message || `'${object}' is function`)
        );
    }

    /**
     * 断言 value 等于 other
     *
     * @param object 断言参数对象
     * @param object.value 参与断言的第一个参数
     * @param object.other 参与断言的第二个参数
     * @param message 断言错误信息
     */
    public static isEqual<T>({ value, other }: { value: T; other: T }, message?: string): void {
        return AssertUtils.isTrue(
            { value, other },
            VerifyUtils.isEqual,
            AssertError.createErrorFunction(message || `'${value}' is not equal to '${other}'`)
        );
    }

    /**
     * 断言 value 不等于 other
     *
     * @param object 断言参数对象
     * @param object.value 参与断言的第一个参数
     * @param object.other 参与断言的第二个参数
     * @param message 断言错误信息
     */
    public static isNotEqual<T>({ value, other }: { value: T; other: T }, message?: string): void {
        return AssertUtils.isTrue(
            { value, other },
            VerifyUtils.isNotEqual,
            AssertError.createErrorFunction(message || `'${value}' is not equal to '${other}'`)
        );
    }
}

export default AssertUtils;
