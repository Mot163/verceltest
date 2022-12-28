import DecoratorUtils from '../../common/utils/DecoratorUtils';
import IDecorator from '../../common/interface/IDecorator';
import Class from '../../common/type/Class';
import BeanFactory from '../BeanFactory';
import BeanDefinition from '../config/BeanDefinition';
import NoSuchBeanDefinitionError from '../NoSuchBeanDefinitionError';

/**
 * 默认可列举Bean工厂
 */
class DefaultListableBeanFactory implements BeanFactory {
    /** Bean定义集 */
    protected beanDefinitions: Map<string, BeanDefinition>;

    /** 单例Bean集 */
    protected singletonObjects: Map<string, Object> = new Map();

    /**
     *
     * @param beanDefinitions Bean定义集
     */
    constructor(beanDefinitions?: Map<string, BeanDefinition>) {
        this.beanDefinitions = beanDefinitions || new Map<string, BeanDefinition>();
    }

    /**
     * 获取Bean定义
     *
     * @param beanName Bean名称
     */
    getBeanDefinition(beanName: string): BeanDefinition | undefined {
        return this.beanDefinitions.get(beanName);
    }

    /**
     * 实例化单例bean
     */
    public preInstantiateSingletons(): void {
        for (const [beanName, beanDefinition] of this.beanDefinitions.entries()) {
            if (beanDefinition.isSingleton()) {
                const singletonObject = this.createBean(beanName, beanDefinition);
                this.registerSingleton(beanName, singletonObject);
            }
        }
    }

    /**
     * 注册Bean定义
     *
     * @param beanName Bean名称
     * @param beanDefinition Bean定义
     */
    public registerBeanDefinition(beanName: string, beanDefinition: BeanDefinition): void {
        this.beanDefinitions.set(beanName, beanDefinition);
    }

    /**
     * 注册Bean单例
     *
     * @param beanName Bean名称
     * @param singletonObject Bean单例
     */
    public registerSingleton(beanName: string, singletonObject: Object): void {
        this.singletonObjects.set(beanName, singletonObject);
    }

    /**
     * 获取Bean
     *
     * @param beanName Bean名称
     */
    public getBean(beanName: string, beanDefinition?: BeanDefinition): Object {
        const sharedInstance = this.singletonObjects.get(beanName);
        if (sharedInstance) {
            return sharedInstance;
        }
        beanDefinition ??= this.beanDefinitions.get(beanName);
        if (!beanDefinition) {
            throw new NoSuchBeanDefinitionError(beanName);
        }
        const newInstance = this.createBean(beanName, beanDefinition);
        if (beanDefinition.isSingleton()) {
            this.registerSingleton(beanName, newInstance);
        }
        return newInstance;
    }

    /**
     * 是否包含Bean
     *
     * @param beanName Bean名称
     */
    public containsBean(beanName: string): boolean {
        for (const key of this.beanDefinitions.keys()) {
            if (key === beanName) {
                return true;
            }
        }
        return false;
    }

    /**
     * Bean是否为单例
     *
     * @param beanName Bean名称
     */
    public isSingleton(beanName: string): boolean {
        for (const [key, beanDefinition] of this.beanDefinitions) {
            if (key === beanName) {
                return beanDefinition.isSingleton();
            }
        }
        throw new NoSuchBeanDefinitionError(beanName);
    }

    /**
     * Bean是否为原型
     *
     * @param beanName Bean名称
     */
    public isPrototype(beanName: string): boolean {
        for (const [key, beanDefinition] of this.beanDefinitions) {
            if (key === beanName) {
                return beanDefinition.isPrototype();
            }
        }
        throw new NoSuchBeanDefinitionError(beanName);
    }

    /**
     * 获取BeanClass
     *
     * @param beanName Bean名称
     */
    public getType(beanName: string): Class {
        for (const [key, beanDefinition] of this.beanDefinitions) {
            if (key === beanName) {
                let type = beanDefinition.getType();
                if (!type) {
                    this.getBean(beanName);
                    type = <Class>beanDefinition.getType();
                }
                return type;
            }
        }
        throw new NoSuchBeanDefinitionError(beanName);
    }

    /**
     * 获取指定类及其子类的实例Bean数组
     *
     * @param _class 类对象
     */
    public getBeansOfType(_class: Class): Object[] {
        const list = new Array<Object>();
        for (const [beanName, beanDefinition] of this.beanDefinitions.entries()) {
            let type = beanDefinition.getType();
            let bean: Object | undefined;
            if (!type) {
                bean = this.getBean(beanName, beanDefinition);
                type = <Class>beanDefinition.getType();
            }
            if (type === _class || type.prototype instanceof _class) {
                bean ??= this.getBean(beanName, beanDefinition);
                list.push(bean);
            }
        }
        return list;
    }

    /**
     * 获取具有指定装饰器的Bean数组
     *
     * @param decorator 装饰器
     */
    public getBeansWithAnnotation(decorator: IDecorator): Object[] {
        const list = new Array<Object>();
        for (const [beanName, beanDefinition] of this.beanDefinitions.entries()) {
            let type = beanDefinition.getType();
            let bean: Object | undefined;
            if (!type) {
                bean = this.getBean(beanName, beanDefinition);
                type = <Class>beanDefinition.getType();
            }
            if (DecoratorUtils.hasDecorator(type, decorator)) {
                bean ??= this.getBean(beanName, beanDefinition);
                list.push(bean);
            }
        }
        return list;
    }

    /**
     * 获取指定类及其子类的Bean名称
     *
     * @param _class 类对象
     */
    public getBeanNamesForType(_class: Class): string[] {
        return Array.from(this.beanDefinitions.entries())
            .filter(([beanName, beanDefinition]) => {
                let type = beanDefinition.getType();
                if (!type) {
                    this.getBean(beanName, beanDefinition);
                    type = <Class>beanDefinition.getType();
                }
                return type === _class || type.prototype instanceof _class;
            })
            .map(([beanName]) => beanName);
    }

    /**
     * 获取具有指定装饰器的Bean名称数组
     *
     * @param decorator 装饰器
     */
    public getBeanNamesForAnnotation(decorator: IDecorator): string[] {
        return Array.from(this.beanDefinitions.entries())
            .filter(([beanName, beanDefinition]) => {
                let type = beanDefinition.getType();
                if (!type) {
                    this.getBean(beanName, beanDefinition);
                    type = <Class>beanDefinition.getType();
                }
                return DecoratorUtils.hasDecorator(type, decorator);
            })
            .map(([beanName]) => beanName);
    }

    /**
     * 创建Bean
     *
     * @param beanName Bean名称
     */
    protected createBean(beanName: string, beanDefinition?: BeanDefinition): Object {
        beanDefinition ??= this.beanDefinitions.get(beanName);
        if (!beanDefinition) {
            throw new NoSuchBeanDefinitionError(beanName);
        }
        let bean: any;
        if (beanDefinition.isDefaultBean()) {
            const depends = beanDefinition.getDependsOn();
            const beanClass = <Class>beanDefinition.getType();
            bean = new beanClass();
            for (const depend of depends.getDepends()) {
                bean[depend.key] = this.getBean(depend.value);
            }
        } else {
            const factoryBeanName = <string>beanDefinition.getFactoryBeanName();
            const factoryBean: any = this.getBean(factoryBeanName);
            const factoryMethodName = <string>beanDefinition.getFactoryMethodName();
            bean = factoryBean[factoryMethodName]();
            beanDefinition.setType(Object.getPrototypeOf(bean).constructor);
        }
        return bean;
    }
}

export default DefaultListableBeanFactory;
