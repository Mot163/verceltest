import Class from '../../common/type/Class';
import BeanDefinition from '../config/BeanDefinition';

/**
 * 默认Bean定义
 */
class DefaultBeanDefinition extends BeanDefinition {
    /**
     * @param beanClassName Bean类名
     * @param type BeanClass
     * @param scope 作用域
     */
    constructor(beanClassName: string, type: Class, scope?: string) {
        super();
        this.setBeanClassName(beanClassName);
        this.setType(type);
        this.setScope(scope || BeanDefinition.SCOPE_SINGLETON);
    }
}

export default DefaultBeanDefinition;
