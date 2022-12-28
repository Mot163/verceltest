import IDecorator from '../../../common/interface/IDecorator';
import RequestMethod from '../RequestMethod';

/**
 * 对象参数类型
 */
type Params = {
    /** 路径 */
    path: string | string[];
    /** 请求类型 */
    httpMethod?: RequestMethod | RequestMethod[];
};

/**
 * 请求映射接口
 */
interface IRequestMapping extends IDecorator {
    /**
     * @param value 路径 或 路径和请求类型
     */
    (value: string | string[] | Params): (target: any, propertyKey?: string | symbol) => void;
    metadata: {
        /** 路径 */
        path: string[];
        /** 方法名称 */
        methodName?: string;
        /** 请求类型 */
        httpMethod?: RequestMethod[];
    };
}

export default IRequestMapping;
export { Params };
