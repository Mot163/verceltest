import IDecorator from '../../../common/interface/IDecorator';
import RequestMethod from '../RequestMethod';

/**
 * POST请求映射接口
 */
interface IPostMapping extends IDecorator {
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
        httpMethod: [RequestMethod.POST];
    };
}

export default IPostMapping;
