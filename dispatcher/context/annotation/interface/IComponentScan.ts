import IDecorator from '../../../common/interface/IDecorator';

/**
 * 组件扫描装饰器接口
 */
interface IComponentScan extends IDecorator {
    /**
     * @param value 目录路径
     */
    (value?: string): ClassDecorator;
    metadata: {
        /** 目录路径 */
        value: string;
    };
}

export default IComponentScan;
