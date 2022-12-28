import DecoratorType from '../../common/enum/DecoratorType';
import DecoratorUtils from '../../common/utils/DecoratorUtils';
import RequestMethod from './RequestMethod';
import RequestMapping from './RequestMapping';
import IDeleteMapping from './interface/IDeleteMapping';
import UsingDecoratorError from '../../common/UsingDecoratorError';

/**
 * DELETE请求映射装饰器
 */
const DeleteMapping: IDeleteMapping = function (value: string | string[]): MethodDecorator {
    const path = value instanceof Array ? value : [value];
    const metadata = Object.assign({}, DeleteMapping.metadata, { path });
    return function (target: any, propertyKey: string | symbol): void {
        if (propertyKey) {
            if (typeof target === 'function') {
                const message = `'DeleteMapping' decorator cannot be used on static fields '${propertyKey.toString()}'`;
                throw new UsingDecoratorError(message);
            }
        }
        metadata.methodName = propertyKey?.toString();
        DecoratorUtils.buildToTarget(target, DeleteMapping, DecoratorType.METHOD, metadata);
    };
};
DeleteMapping.metadata = { path: ['/'], methodName: '', httpMethod: [RequestMethod.DELETE] };

// 继承
Object.setPrototypeOf(DeleteMapping.prototype, RequestMapping.prototype);

export default DeleteMapping;
