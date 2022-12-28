import Class from "../common/type/Class";

/**
 * Bean定义获取失败错误
 */
class NoSuchBeanDefinitionError extends Error {
    /**
     * @param value Bean名称 或 Bean类型
     */
    constructor(value: string | Class) {
        const message =
            typeof value === 'string'
                ? `No bean named '${value}' available`
                : `No qualifying bean of type '${value}' available`;
        super(message);
        this.name = 'NoSuchBeanDefinitionError';
    }
}

export default NoSuchBeanDefinitionError;
