import DecoratorType from '../enum/DecoratorType';
import PropertyName from '../enum/PropertyName';
import IDecorator from '../interface/IDecorator';
import Class from '../type/Class';

/**
 * 装饰器集
 */
type DecoratorMap = {
    [DecoratorType.CLASS]: IDecorator[];
    [DecoratorType.METHOD]: IDecorator[];
    [DecoratorType.PROPERTY]: IDecorator[];
    [DecoratorType.PARAMETER]: IDecorator[];
};

/**
 * 装饰器工具类
 */
class DecoratorUtils {
    /** 默认装饰器类型 */
    static DEFAULT_DECORATER_TYPE = DecoratorType.CLASS;

    /**
     * 获取装饰器集
     *
     * @param target 装饰目标对象
     * @returns 装饰器实例列表
     */
    public static getDecoratorMap(target: Object): DecoratorMap {
        let decoratorMap: DecoratorMap = Object.getOwnPropertyDescriptor(target, PropertyName.DECORATOR)?.value;
        if (!decoratorMap) {
            decoratorMap = {
                [DecoratorType.CLASS]: [],
                [DecoratorType.METHOD]: [],
                [DecoratorType.PROPERTY]: [],
                [DecoratorType.PARAMETER]: []
            };
            Object.defineProperty(target, PropertyName.DECORATOR, { value: decoratorMap });
        }
        return decoratorMap;
    }

    /**
     * 获取装饰器列表
     *
     * @param target 装饰目标对象
     * @param type 装饰器类型
     * @returns 装饰器实例列表
     */
    public static getDecoratorList(target: Object, type?: DecoratorType): IDecorator[] {
        const decoratorMap = DecoratorUtils.getDecoratorMap(target);
        return decoratorMap[type || DecoratorUtils.DEFAULT_DECORATER_TYPE];
    }

    /**
     * 获取装饰器
     *
     * @param target 装饰目标对象
     * @param decorator 装饰器函数对象
     * @param type 装饰器类型
     * @returns 装饰器实例
     */
    public static getDecorator<T extends IDecorator>(target: Object, decorator: T, type?: DecoratorType): T[] {
        const decorators = DecoratorUtils.getDecoratorList(target, type);
        if (decorators.length === 0) {
            return [];
        }
        return <T[]>decorators.filter((item) => item instanceof decorator);
    }

    /**
     * 判断是否存在装饰器
     *
     * @param target 装饰目标对象
     * @param decorator 装饰器函数对象
     * @param type 装饰器类型
     * @returns 装饰器实例
     */
    public static hasDecorator<T extends IDecorator>(target: Object, decorator: T, type?: DecoratorType): boolean {
        const decorators = DecoratorUtils.getDecoratorList(target, type);
        if (decorators.length === 0) {
            return false;
        }
        return decorators.find((item) => item instanceof decorator) ? true : false;
    }

    /**
     * 构建装饰器实例到目标对象
     *
     * @param target 装饰目标对象
     * @param decorator 装饰器函数对象
     * @param type 装饰器类型
     * @param metadata 装饰器实例元数据
     * @returns 装饰器实例
     */
    public static buildToTarget<T extends IDecorator>(
        target: Object,
        decorator: T,
        type: DecoratorType,
        metadata?: typeof decorator.metadata
    ): void {
        const instance = Object.setPrototypeOf({ metadata }, decorator.prototype);
        const decorators = DecoratorUtils.getDecoratorList(target, type);
        decorators.push(instance);
        if (type === DecoratorType.CLASS) {
            const decorators = DecoratorUtils.getDecoratorList((<Class>target).prototype, type);
            decorators.push(instance);
        }
    }
}

export default DecoratorUtils;
