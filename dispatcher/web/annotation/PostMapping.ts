import DecoratorType from '../../common/enum/DecoratorType';
import DecoratorUtils from '../../common/utils/DecoratorUtils';
import UsingDecoratorError from '../../common/UsingDecoratorError';
import IPostMapping from './interface/IPostMapping';
import RequestMethod from './RequestMethod';
import RequestMapping from './RequestMapping';

/**
 * POST请求映射装饰器
 */
const PostMapping: IPostMapping = function (value: string | string[]): MethodDecorator {
    const path = value instanceof Array ? value : [value];
    const metadata = Object.assign({}, PostMapping.metadata, { path });
    return function (target: any, propertyKey: string | symbol): void {
        if (propertyKey) {
            if (typeof target === 'function') {
                const message = `'PostMapping' decorator cannot be used on static fields '${propertyKey.toString()}'`;
                throw new UsingDecoratorError(message);
            }
        }
        metadata.methodName = propertyKey?.toString();
        DecoratorUtils.buildToTarget(target, PostMapping, DecoratorType.METHOD, metadata);
    };
};
PostMapping.metadata = { path: ['/'], methodName: '', httpMethod: [RequestMethod.POST] };

// 继承
Object.setPrototypeOf(PostMapping.prototype, RequestMapping.prototype);

export default PostMapping;
