import DecoratorType from '../../common/enum/DecoratorType';
import DecoratorUtils from '../../common/utils/DecoratorUtils';
import IController from './interface/IController';
import Component from './Component';

/**
 * 控制器装饰器
 */
const Controller: IController = function (value?: string): ClassDecorator {
    const metadata = Object.assign({}, Controller.metadata, { value });
    return function (target: Object) {
        DecoratorUtils.buildToTarget(target, Controller, DecoratorType.CLASS, metadata);
    };
};
Controller.metadata = { value: '' };

// 继承
Object.setPrototypeOf(Controller.prototype, Component.prototype);

export default Controller;
