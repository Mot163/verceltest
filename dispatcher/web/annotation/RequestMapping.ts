import DecoratorType from '../../common/enum/DecoratorType';
import UsingDecoratorError from '../../common/UsingDecoratorError';
import DecoratorUtils from '../../common/utils/DecoratorUtils';
import IRequestMapping, { Params } from './interface/IRequestMapping';

/**
 * 请求映射装饰器
 */
const RequestMapping: IRequestMapping = function (
    value: string | string[] | Params
): (target: any, propertyKey?: string | symbol) => void {
    const metadata = Object.assign({}, RequestMapping.metadata);
    if (typeof value === 'string') {
        metadata.path = [value];
    } else if (value instanceof Array) {
        metadata.path = value;
    } else {
        metadata.path = value.path instanceof Array ? value.path : [value.path];
        if (value.httpMethod) {
            metadata.httpMethod = value.httpMethod instanceof Array ? value.httpMethod : [value.httpMethod];
        }
    }
    return function (target: any, propertyKey?: string | symbol): void {
        let type = DecoratorType.CLASS;
        if (propertyKey) {
            if (typeof target === 'function') {
                const message = `'RequestMapping' decorator cannot be used on static fields '${propertyKey.toString()}'`;
                throw new UsingDecoratorError(message);
            }
            type = DecoratorType.METHOD;
        }
        metadata.methodName = propertyKey?.toString();
        DecoratorUtils.buildToTarget(target, RequestMapping, type, metadata);
    };
};
RequestMapping.metadata = { path: ['/'] };

export default RequestMapping;
