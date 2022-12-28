import DecoratorType from '../../common/enum/DecoratorType';
import DecoratorUtils from '../../common/utils/DecoratorUtils';
import IBean from './interface/IBean';

/**
 * 方法组件装饰器
 */
const Bean: IBean = function (value?: string): MethodDecorator {
    return function (target: any, propertyKey: string | symbol) {
        const metadata = Object.assign({}, Bean.metadata, { key: propertyKey.toString(), value });
        DecoratorUtils.buildToTarget(target, Bean, DecoratorType.METHOD, metadata);
    };
};
Bean.metadata = { value: '', key: '' };

export default Bean;
