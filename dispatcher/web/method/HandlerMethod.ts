import BeanFactory from '../../beans/BeanFactory';
import AssertUtils from '../../common/utils/AssertUtils';
import Class from '../../common/type/Class';
import VerifyUtils from '../../common/utils/VerifyUtils';
import IRequestParam from '../annotation/interface/IRequestParam';
import IPathVariable from '../annotation/interface/IPathVariable';
import DecoratorUtils from '../../common/utils/DecoratorUtils';
import RequestParam from '../annotation/RequestParam';
import DecoratorType from '../../common/enum/DecoratorType';
import PathVariable from '../annotation/PathVariable';
import RequestBody from '../annotation/RequestBody';
import IRequestBody from '../annotation/interface/IRequestBody';

/** Handler方法参数 */
type HandlerMethodParameter = {
    name: string;
    index: number;
    decorator: IPathVariable | IRequestParam | IRequestBody;
};

/**
 * Handler方法
 */
class HandlerMethod {
    /** Bean */
    private bean: Object;

    /** BeanClass */
    private beanType: Class;

    /** 方法 */
    private method: Function;

    /** 方法参数列表 */
    private parameters: HandlerMethodParameter[];

    /** 方法参数最大索引值 */
    private maxIndex: number;

    /**
     * @param bean Bean对象 或 Bean名称
     * @param method 方法 或 方法名称
     * @param beanFactory Bean工厂
     */
    constructor(bean: Object, method: Function | string, beanFactory?: BeanFactory) {
        this.bean = this.resolveBean(bean, beanFactory);
        this.beanType = Object.getPrototypeOf(bean).constructor;
        this.method = this.resolveMethod(this.bean, method);
        this.parameters = this.initMethodParameters(this.beanType, this.method.name);
        this.maxIndex = this.initMaxIndex(this.parameters);
    }

    /**
     * 获取Bean
     */
    public getBean(): Object {
        return this.bean;
    }

    /**
     * 获取BeanClass
     */
    public getBeanType(): Class {
        return this.beanType;
    }

    /**
     * 获取方法
     */
    public getMethod(): Function {
        return this.method;
    }

    /**
     * 获取方法参数列表
     */
    public getMethodParameters(): HandlerMethodParameter[] {
        return this.parameters;
    }

    /**
     * 获取方法参数最大索引值
     */
    public getMaxIndex(): number {
        return this.maxIndex;
    }

    /**
     * 比较
     *
     * @param other 其他Handler方法
     */
    public compareTo(other: HandlerMethod): number {
        return VerifyUtils.isEqual({ value: this.bean, other: other.getBean() }) &&
            VerifyUtils.isEqual({ value: this.method, other: other.getMethod() })
            ? 0
            : -1;
    }

    /**
     * 初始化方法参数列表
     *
     * @param beanType Bean类型
     * @param methodName 方法名称
     */
    private initMethodParameters(beanType: Class, methodName: string): HandlerMethodParameter[] {
        const parameters = new Array<HandlerMethodParameter>();
        parameters.push(...this.resolveMethodParameters(beanType, methodName, PathVariable));
        parameters.push(...this.resolveMethodParameters(beanType, methodName, RequestParam));
        parameters.push(...this.resolveMethodParameters(beanType, methodName, RequestBody));
        return parameters;
    }

    /**
     * 方法参数最大索引值
     */
    private initMaxIndex(parameters: HandlerMethodParameter[]): number {
        let maxIndex = -1;
        for (const parameter of parameters) {
            if (parameter.index > maxIndex) {
                maxIndex = parameter.index;
            }
        }
        return maxIndex;
    }

    /**
     * 解析处理Bean
     *
     * @param bean Bean
     * @param beanFactory Bean工厂
     */
    private resolveBean(bean: Object, beanFactory?: BeanFactory): Object {
        if (VerifyUtils.isString(bean)) {
            AssertUtils.isNotNil(beanFactory, 'Cannot resolve bean name without BeanFactory');
            const beanName = <string>bean;
            return (<BeanFactory>beanFactory).getBean(beanName);
        }
        return (this.bean = bean);
    }

    /**
     * 解析处理方法
     *
     * @param bean Bean
     * @param method 方法
     */
    private resolveMethod(bean: Object, method: Function | string): Function {
        if (VerifyUtils.isString(method)) {
            const fun = (<any>bean)[<string>method];
            AssertUtils.isNotNil(fun, `not found '${method}' in bean`);
            AssertUtils.isFunction(fun, `'${method}' is not function in bean`);
            return fun;
        }
        return <Function>method;
    }

    /**
     * 解析方法参数
     *
     * @param beanType Bean类型
     * @param methodName 方法名称
     * @param decorator 装饰器
     */
    private resolveMethodParameters(
        beanType: Class,
        methodName: string,
        decorator: IPathVariable | IRequestParam | IRequestBody
    ): HandlerMethodParameter[] {
        const parameters = new Array<HandlerMethodParameter>();
        let decorators = DecoratorUtils.getDecorator(beanType.prototype, decorator, DecoratorType.PARAMETER);
        if (decorator === RequestBody && decorators.length > 1) {
            throw new Error(`method[${methodName}] has too many body parameters`);
        }
        decorators = decorators.filter((decorator) => decorator.metadata.key === methodName);
        for (const decorator of decorators) {
            parameters.push({
                name: (<any>decorator.metadata).value || 'body',
                index: decorator.metadata.index,
                decorator
            });
        }
        return parameters;
    }
}

export default HandlerMethod;
