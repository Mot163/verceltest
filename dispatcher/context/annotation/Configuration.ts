import DecoratorType from '../../common/enum/DecoratorType';
import DecoratorUtils from '../../common/utils/DecoratorUtils';
import IConfiguration from './interface/IConfiguration';
import Component from '../stereotype/Component';

/**
 * 配置装饰器
 */
const Configuration: IConfiguration = function (value?: string): ClassDecorator {
    const metadata = Object.assign({}, Configuration.metadata, { value });
    return function (target: Object) {
        DecoratorUtils.buildToTarget(target, Configuration, DecoratorType.CLASS, metadata);
    };
};
Configuration.metadata = { value: '' };

// 继承
Object.setPrototypeOf(Configuration.prototype, Component.prototype);

export default Configuration;
