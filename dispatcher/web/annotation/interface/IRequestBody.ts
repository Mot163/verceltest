import IDecorator from '../../../common/interface/IDecorator';

/**
 * 请求体接口
 */
interface IRequestBody extends IDecorator {
    (): ParameterDecorator;
    metadata: {
        /** 方法名称 */
        key: string;
        /** 参数索引 */
        index: number;
    };
}

export default IRequestBody;
