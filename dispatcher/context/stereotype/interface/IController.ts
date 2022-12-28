import IDecorator from '../../../common/interface/IDecorator';

/**
 * 控制器装饰器接口
 */
interface IController extends IDecorator {
    /**
     * @param value 组件名称
     */
    (value?: string): ClassDecorator;
    metadata: {
        /** 组件名称 */
        value: string;
    };
}

export default IController;
