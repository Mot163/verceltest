import IDecorator from '../../../common/interface/IDecorator';

/**
 * 存储装饰器接口
 */
interface IRepository extends IDecorator {
    /**
     * @param value 组件名称
     */
    (value?: string): ClassDecorator;
    metadata: {
        /** 组件名称 */
        value: string;
    };
}

export default IRepository;
