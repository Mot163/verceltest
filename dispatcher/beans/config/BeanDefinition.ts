import AssertUtils from '../../common/utils/AssertUtils';
import DecoratorUtils from '../../common/utils/DecoratorUtils';
import DecoratorType from '../../common/enum/DecoratorType';
import Class from '../../common/type/Class';
import Autowired from '../annotation/Autowired';
import Depends from './Depends';

/**
 * Bean定义
 */
abstract class BeanDefinition {
    /** 单例 */
    public static SCOPE_SINGLETON = 'singleton';

    /** 原型 */
    public static SCOPE_PROTOTYPE = 'prototype';

    /** Bean类型 */
    private type: Class | undefined;

    /** Bean类名 */
    private beanClassName: string | undefined;

    /** 工厂Bean名称 */
    private factoryBeanName: string | undefined;

    /** 工厂方法名称 */
    private factoryMethodName: string | undefined;

    /** Bean依赖 */
    private dependsOn: Depends | undefined;

    /** Bean作用域 */
    private scope: string | undefined;

    /**
     * 获取Bean类型
     */
    public getType(): Class | undefined {
        return this.type;
    }

    /**
     * 设置Bean类型
     *
     * @param type BeanClass
     */
    public setType(type: Class): void {
        this.type = type;
    }

    /**
     * 获取Bean类名
     */
    public getBeanClassName(): string {
        return <string>this.beanClassName;
    }

    /**
     * 设置Bean类名
     *
     * @param beanClassName Bean类名
     */
    public setBeanClassName(beanClassName: string): void {
        this.beanClassName = beanClassName;
    }

    /**
     * 获取工厂Bean名称
     */
    public getFactoryBeanName(): string | undefined {
        return this.factoryBeanName;
    }

    /**
     * 设置BeanClass
     *
     * @param factoryBeanName 工厂Bean名称
     */
    public setFactoryBeanName(factoryBeanName: string): void {
        this.factoryBeanName = factoryBeanName;
    }

    /**
     * 获取工厂方法名称
     */
    public getFactoryMethodName(): string | undefined {
        return this.factoryMethodName;
    }

    /**
     * 设置工厂方法名称
     *
     * @param factoryMethodName 工厂方法名称
     */
    public setFactoryMethodName(factoryMethodName: string): void {
        this.factoryMethodName = factoryMethodName;
    }

    /**
     * 获取Bean依赖
     */
    public getDependsOn(): Depends {
        if (!this.dependsOn) {
            AssertUtils.isNotNil(this.type);
            const beanClass = <Class>this.type;
            const autowireds = DecoratorUtils.getDecorator(beanClass.prototype, Autowired, DecoratorType.PROPERTY);
            this.dependsOn = new Depends(...autowireds.map((autowired) => autowired.metadata));
        }
        return this.dependsOn;
    }

    /**
     * 获取作用域
     */
    public getScope(): string | undefined {
        return this.scope;
    }

    /**
     * 设置作用域
     *
     * @param scope 作用域
     */
    public setScope(scope: string): void {
        this.scope = scope;
    }

    /**
     * 是否为单例
     */
    public isSingleton(): boolean {
        return this.scope === BeanDefinition.SCOPE_SINGLETON;
    }

    /**
     * 是否为原型
     */
    public isPrototype(): boolean {
        return this.scope === BeanDefinition.SCOPE_PROTOTYPE;
    }

    /**
     * 是否为默认Bean
     */
    public isDefaultBean(): boolean {
        return this.factoryBeanName === undefined;
    }

    /**
     * 是否为方法Bean
     */
    public isMethodBean(): boolean {
        return this.factoryBeanName !== undefined;
    }
}

export default BeanDefinition;
