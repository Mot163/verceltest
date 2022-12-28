import IDecorator from '../../../common/interface/IDecorator';

/**
 * 配置装饰器接口
 */
interface IConfiguration extends IDecorator {
    /**
     * @param value 配置名称
     */
    (value?: string): ClassDecorator;
    metadata: {
        /** 配置名称 */
        value: string;
    };
}

export default IConfiguration;
