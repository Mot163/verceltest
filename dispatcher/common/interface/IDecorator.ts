import IMetadata from './IMetadata';

/**
 * 装饰器接口
 */
interface IDecorator {
    /** 装饰器函数 */
    (...props: any[]): ClassDecorator | MethodDecorator | PropertyDecorator | ParameterDecorator;
    /** 元数据 */
    metadata?: IMetadata;
}

export default IDecorator;
