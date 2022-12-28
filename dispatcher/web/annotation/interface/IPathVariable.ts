import IDecorator from '../../../common/interface/IDecorator';

/**
 * 路径参数接口
 */
interface IPathVariable extends IDecorator {
    /**
     * @param value 参数名称
     */
    (value: string): ParameterDecorator;
    metadata: {
        /** 参数名称 */
        value: string;
        /** 方法名称 */
        key: string;
        /** 参数索引 */
        index: number;
    };
}

export default IPathVariable;
