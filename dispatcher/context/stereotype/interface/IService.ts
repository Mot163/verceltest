import IDecorator from '../../../common/interface/IDecorator';

/**
 * 服务装饰器接口
 */
interface IService extends IDecorator {
    /**
     * @param value 组件名称
     */
    (value?: string): ClassDecorator;
    metadata: {
        /** 组件名称 */
        value: string;
    };
}

export default IService;
