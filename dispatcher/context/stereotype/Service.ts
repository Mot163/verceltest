import DecoratorType from '../../common/enum/DecoratorType';
import DecoratorUtils from '../../common/utils/DecoratorUtils';
import IService from './interface/IService';
import Component from './Component';

/**
 * 服务装饰器
 */
const Service: IService = function (value?: string): ClassDecorator {
    const metadata = Object.assign({}, Service.metadata, { value });
    return function (target: Object) {
        DecoratorUtils.buildToTarget(target, Service, DecoratorType.CLASS, metadata);
    };
};
Service.metadata = { value: '' };

// 继承
Object.setPrototypeOf(Service.prototype, Component.prototype);

export default Service;
