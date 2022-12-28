import DecoratorType from '../../common/enum/DecoratorType';
import DecoratorUtils from '../../common/utils/DecoratorUtils';
import IRequestParam from './interface/IRequestParam';

/**
 * 请求参数装饰器
 */
const RequestParam: IRequestParam = function (value: string): ParameterDecorator {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number): void {
        const metadata = Object.assign({}, RequestParam.metadata, { value, key: propertyKey, index: parameterIndex });
        DecoratorUtils.buildToTarget(target, RequestParam, DecoratorType.PARAMETER, metadata);
    };
};
RequestParam.metadata = { value: '', key: '', index: 0 };

export default RequestParam;
