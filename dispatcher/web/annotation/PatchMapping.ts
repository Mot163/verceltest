import DecoratorType from '../../common/enum/DecoratorType';
import DecoratorUtils from '../../common/utils/DecoratorUtils';
import UsingDecoratorError from '../../common/UsingDecoratorError';
import IPatchMapping from './interface/IPatchMapping';
import RequestMethod from './RequestMethod';
import RequestMapping from './RequestMapping';

/**
 * PATCH请求映射装饰器
 */
const PatchMapping: IPatchMapping = function (value: string | string[]): MethodDecorator {
    const path = value instanceof Array ? value : [value];
    const metadata = Object.assign({}, PatchMapping.metadata, { path });
    return function (target: any, propertyKey: string | symbol): void {
        if (propertyKey) {
            if (typeof target === 'function') {
                const message = `'PatchMapping' decorator cannot be used on static fields '${propertyKey.toString()}'`;
                throw new UsingDecoratorError(message);
            }
        }
        metadata.methodName = propertyKey?.toString();
        DecoratorUtils.buildToTarget(target, PatchMapping, DecoratorType.METHOD, metadata);
    };
};
PatchMapping.metadata = { path: ['/'], methodName: '', httpMethod: [RequestMethod.PATCH] };

// 继承
Object.setPrototypeOf(PatchMapping.prototype, RequestMapping.prototype);

export default PatchMapping;
