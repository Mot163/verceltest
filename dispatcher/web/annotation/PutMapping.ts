import DecoratorType from '../../common/enum/DecoratorType';
import DecoratorUtils from '../../common/utils/DecoratorUtils';
import UsingDecoratorError from '../../common/UsingDecoratorError';
import IPutMapping from './interface/IPutMapping';
import RequestMethod from './RequestMethod';
import RequestMapping from './RequestMapping';

/**
 * PUT请求映射装饰器
 */
const PutMapping: IPutMapping = function (value: string | string[]): MethodDecorator {
    const path = value instanceof Array ? value : [value];
    const metadata = Object.assign({}, PutMapping.metadata, { path });
    return function (target: any, propertyKey: string | symbol): void {
        if (propertyKey) {
            if (typeof target === 'function') {
                const message = `'PutMapping' decorator cannot be used on static fields '${propertyKey.toString()}'`;
                throw new UsingDecoratorError(message);
            }
        }
        metadata.methodName = propertyKey?.toString();
        DecoratorUtils.buildToTarget(target, PutMapping, DecoratorType.METHOD, metadata);
    };
};
PutMapping.metadata = { path: ['/'], methodName: '', httpMethod: [RequestMethod.PUT] };

// 继承
Object.setPrototypeOf(PutMapping.prototype, RequestMapping.prototype);

export default PutMapping;
