import DecoratorType from '../../common/enum/DecoratorType';
import DecoratorUtils from '../../common/utils/DecoratorUtils';
import IPathVariable from './interface/IPathVariable';

/**
 * 路径参数装饰器
 */
const PathVariable: IPathVariable = function (value: string): ParameterDecorator {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number): void {
        const metadata = Object.assign({}, PathVariable.metadata, { value, key: propertyKey, index: parameterIndex });
        DecoratorUtils.buildToTarget(target, PathVariable, DecoratorType.PARAMETER, metadata);
    };
};
PathVariable.metadata = { value: '', key: '', index: 0 };

export default PathVariable;
