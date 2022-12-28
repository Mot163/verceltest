import Class from '../../common/type/Class';
import DefaultListableBeanFactory from '../../beans/support/DefaultListableBeanFactory';

/**
 * 应用
 */
abstract class AbstractApplicationContext {
    /**
     * 刷新容器
     */
    public async refresh(): Promise<void> {
        await this.initApplication();
        const beanFactory = this.getBeanFactory();
        this.onRefresh();
        this.initBeanFactory(beanFactory);
    }

    /**
     * 初始化应用
     */
    protected async initApplication(): Promise<void> {}

    /**
     * 初始化Bean工厂，创建单例bean
     */
    protected initBeanFactory(beanFactory: DefaultListableBeanFactory): void {
        beanFactory.preInstantiateSingletons();
    }

    /**
     * 刷新应用
     */
    protected onRefresh(): void {}

    /**
     * 获取Bean
     *
     * @param beanName Bean名称
     */
    public getBean(beanName: string): Object {
        return this.getBeanFactory().getBean(beanName);
    }

    /**
     * 是否包含Bean
     *
     * @param beanName Bean名称
     */
    public containsBean(beanName: string): boolean {
        return this.getBeanFactory().containsBean(beanName);
    }

    /**
     * Bean是否为单例
     *
     * @param beanName Bean名称
     */
    public isSingleton(beanName: string): boolean {
        return this.getBeanFactory().isSingleton(beanName);
    }

    /**
     * Bean是否为原型
     *
     * @param beanName Bean名称
     */
    public isPrototype(beanName: string): boolean {
        return this.getBeanFactory().isPrototype(beanName);
    }

    /**
     * 获取BeanClass
     *
     * @param beanName Bean名称
     */
    public getType(beanName: string): Class {
        return this.getBeanFactory().getType(beanName);
    }

    /**
     * 获取Bean工厂
     */
    public abstract getBeanFactory(): DefaultListableBeanFactory;
}

export default AbstractApplicationContext;
