import DecoratorType from '../../common/enum/DecoratorType';
import DecoratorUtils from '../../common/utils/DecoratorUtils';
import IRepository from './interface/IRepository';
import Component from './Component';

/**
 * 存储装饰器
 */
const Repository: IRepository = function (value?: string): ClassDecorator {
    const metadata = Object.assign({}, Repository.metadata, { value });
    return function (target: Object) {
        DecoratorUtils.buildToTarget(target, Repository, DecoratorType.CLASS, metadata);
    };
};
Repository.metadata = { value: '' };

// 继承
Object.setPrototypeOf(Repository.prototype, Component.prototype);

export default Repository;
