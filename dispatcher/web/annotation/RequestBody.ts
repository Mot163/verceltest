import DecoratorType from '../../common/enum/DecoratorType';
import DecoratorUtils from '../../common/utils/DecoratorUtils';
import IRequestBody from './interface/IRequestBody';

/**
 * 请求体装饰器
 */
const RequestBody: IRequestBody = function (): ParameterDecorator {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number): void {
        const metadata = Object.assign({}, RequestBody.metadata, { key: propertyKey, index: parameterIndex });
        DecoratorUtils.buildToTarget(target, RequestBody, DecoratorType.PARAMETER, metadata);
    };
};
RequestBody.metadata = { key: '', index: 0 };

export default RequestBody;
