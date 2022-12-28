import DecoratorType from '../../common/enum/DecoratorType';
import DecoratorUtils from '../../common/utils/DecoratorUtils';
import IComponentScan from './interface/IComponentScan';
import StackUtils from '../../common/utils/StackUtils';
import PathUtils from '../../common/utils/PathUtils';

/**
 * 组件扫描装饰器
 */
const ComponentScan: IComponentScan = function (value?: string): ClassDecorator {
    if (!value) {
        const stackFileNameList = StackUtils.getStackFileNameList().filter((item) => item != null);
        const index = stackFileNameList.findIndex((item) => item !== stackFileNameList[0]);
        value = PathUtils.getDirnameByURL(stackFileNameList[index]);
    }
    const metadata = Object.assign({}, ComponentScan.metadata, { value });
    return function (target: Object): void {
        DecoratorUtils.buildToTarget(target, ComponentScan, DecoratorType.CLASS, metadata);
    };
};
ComponentScan.metadata = { value: '' };

export default ComponentScan;
