import IDecorator from '../../../common/interface/IDecorator';

/**
 * 组件装饰器接口
 */
interface IComponent extends IDecorator {
    /**
     * @param value 组件名称
     */
    (value?: string): ClassDecorator;
    metadata: {
        /** 组件名称 */
        value: string;
    };
}

export default IComponent;
