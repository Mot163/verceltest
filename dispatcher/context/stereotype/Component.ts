import DecoratorType from '../../common/enum/DecoratorType';
import DecoratorUtils from '../../common/utils/DecoratorUtils';
import IComponent from './interface/IComponent';

/**
 * 组件装饰器
 */
const Component: IComponent = function (value?: string): ClassDecorator {
    const metadata = Object.assign({}, Component.metadata, { value });
    return function (target: Object) {
        DecoratorUtils.buildToTarget(target, Component, DecoratorType.CLASS, metadata);
    };
};
Component.metadata = { value: '' };

export default Component;
