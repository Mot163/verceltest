import IDecorator from '../../../common/interface/IDecorator';

/**
 * 方法组件装饰器接口
 */
interface IBean extends IDecorator {
    /**
     * @param value Bean名称
     */
    (value?: string): MethodDecorator;
    metadata: {
        /** Bean名称 */
        value: string;
        /** 方法名称 */
        key: string;
    };
}

export default IBean;
