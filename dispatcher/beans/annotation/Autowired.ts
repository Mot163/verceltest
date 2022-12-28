import DecoratorUtils from '../../common/utils/DecoratorUtils';
import DecoratorType from '../../common/enum/DecoratorType';
import UsingDecoratorError from '../../common/UsingDecoratorError';
import IAutowired from './interface/IAutowired';

/**
 * 自动装配装饰器
 */
const Autowired: IAutowired = function (value?: string): PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol): void {
        if (typeof target === 'function') {
            throw new UsingDecoratorError(`do not autowire static fields '${propertyKey.toString()}'`);
        }
        value ??= propertyKey.toString();
        const metadata = Object.assign({}, Autowired.metadata, { value, key: propertyKey });
        DecoratorUtils.buildToTarget(target, Autowired, DecoratorType.PROPERTY, metadata);
    };
};
Autowired.metadata = { value: '', key: '' };

export default Autowired;
