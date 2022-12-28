import DecoratorType from '../../common/enum/DecoratorType';
import DecoratorUtils from '../../common/utils/DecoratorUtils';
import IScope from './interface/IScope';

/**
 * 作用域装饰器
 */
const Scope: IScope = function (value: string): (target: any, propertyKey?: string | symbol) => void {
    return function (target: any, propertyKey?: string | symbol): void {
        const type = propertyKey ? DecoratorType.METHOD : DecoratorType.CLASS;
        const metadata = Object.assign({}, Scope.metadata, { value, key: propertyKey?.toString() });
        DecoratorUtils.buildToTarget(target, Scope, type, metadata);
    };
};
Scope.metadata = { value: '' };

export default Scope;
