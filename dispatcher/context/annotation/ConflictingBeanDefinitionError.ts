/**
 * Bean定义冲突错误
 */
class ConflictingBeanDefinitionError extends Error {
    /**
     * @param beanName Bean名称
     * @param existingBeanClassName 已存在BeanClassName
     * @param beanClassName 新BeanClassName
     */
    constructor(beanName: string, existingBeanClassName: string, beanClassName: string) {
        let message = `Annotation-specified bean name '${beanName}' for bean class [${existingBeanClassName}] conflicts with existing, `;
        message += `non-compatible bean definition of same name and class [${beanClassName}]`;
        super(message);
        this.name = 'ConflictingBeanDefinitionError';
    }
}

export default ConflictingBeanDefinitionError;
