import IDecorator from "../../../common/interface/IDecorator";

/**
 * 自动装配装饰器接口
 */
interface IAutowired extends IDecorator {
    /**
     * @param value Bean名称
     */
    (value?: string): PropertyDecorator;
    metadata: {
        /** Bean名称 */
        value: string;
        /** 属性Key */
        key: string;
    };
}

export default IAutowired;
