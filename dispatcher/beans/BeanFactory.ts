import Class from '../common/type/Class';

/**
 * Bean工厂
 */
interface BeanFactory {
    /**
     * 获取Bean
     *
     * @param beanName Bean名称
     */
    getBean(beanName: string): Object;

    /**
     * 是否包含Bean
     *
     * @param beanName Bean名称
     */
    containsBean(beanName: string): boolean;

    /**
     * Bean是否为单例
     *
     * @param beanName Bean名称
     */
    isSingleton(beanName: string): boolean;

    /**
     * Bean是否为原型
     *
     * @param beanName Bean名称
     */
    isPrototype(beanName: string): boolean;

    /**
     * 获取Bean类型
     *
     * @param beanName Bean名称
     */
    getType(beanName: string): Class;
}

export default BeanFactory;
