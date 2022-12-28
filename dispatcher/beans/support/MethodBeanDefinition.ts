import BeanDefinition from '../config/BeanDefinition';

/**
 * 方法Bean定义
 */
class MethodBeanDefinition extends BeanDefinition {
    /**
     * @param beanClassName Bean类名
     * @param factoryBeanName 工厂Bean名称
     * @param factoryMethodName 工厂方法名称
     * @param scope 作用域
     */
    constructor(beanClassName: string, factoryBeanName: string, factoryMethodName: string, scope?: string) {
        super();
        this.setBeanClassName(beanClassName);
        this.setFactoryBeanName(factoryBeanName);
        this.setFactoryMethodName(factoryMethodName);
        this.setScope(scope || BeanDefinition.SCOPE_SINGLETON);
    }
}

export default MethodBeanDefinition;
