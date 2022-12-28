import IDecorator from '../../../common/interface/IDecorator';
import RequestMethod from '../RequestMethod';

/**
 * GET请求映射接口
 */
interface IGetMapping extends IDecorator {
    /**
     * @param value 路径
     */
    (value: string | string[]): MethodDecorator;
    metadata: {
        /** 路径 */
        path: string[];
        /** 方法名称 */
        methodName: string;
        /** 请求类型 */
        httpMethod: [RequestMethod.GET];
    };
}

export default IGetMapping;
