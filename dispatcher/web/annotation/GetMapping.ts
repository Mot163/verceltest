import DecoratorType from '../../common/enum/DecoratorType';
import DecoratorUtils from '../../common/utils/DecoratorUtils';
import UsingDecoratorError from '../../common/UsingDecoratorError';
import IGetMapping from './interface/IGetMapping';
import RequestMethod from './RequestMethod';
import RequestMapping from './RequestMapping';

/**
 * GET请求映射装饰器
 */
const GetMapping: IGetMapping = function (value: string | string[]): MethodDecorator {
    const path = value instanceof Array ? value : [value];
    const metadata = Object.assign({}, GetMapping.metadata, { path });
    return function (target: any, propertyKey: string | symbol): void {
        if (propertyKey) {
            if (typeof target === 'function') {
                const message = `'GetMapping' decorator cannot be used on static fields '${propertyKey.toString()}'`;
                throw new UsingDecoratorError(message);
            }
        }
        metadata.methodName = propertyKey?.toString();
        DecoratorUtils.buildToTarget(target, GetMapping, DecoratorType.METHOD, metadata);
    };
};
GetMapping.metadata = { path: ['/'], methodName: '', httpMethod: [RequestMethod.GET] };

// 继承
Object.setPrototypeOf(GetMapping.prototype, RequestMapping.prototype);

export default GetMapping;
