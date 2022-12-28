import DefaultBeanDefinition from '../../../beans/support/DefaultBeanDefinition';
import Class from '../../../common/type/Class';
import DecoratorUtils from '../../../common/utils/DecoratorUtils';
import FileUtils from '../../../common/utils/FileUtils';
import Introspector from '../../../common/utils/Introspector';
import ComponentScan from '../../annotation/ComponentScan';
import ConflictingBeanDefinitionError from '../../annotation/ConflictingBeanDefinitionError';
import Scope from '../../annotation/Scope';
import Component from '../../stereotype/Component';
import AbstractApplicationContext from '../AbstractApplicationContext';
import DefaultListableBeanFactory from '../../../beans/support/DefaultListableBeanFactory';
import Configuration from '../../annotation/Configuration';
import Bean from '../../annotation/Bean';
import DecoratorType from '../../../common/enum/DecoratorType';
import BeanDefinition from '../../../beans/config/BeanDefinition';
import IBean from '../../annotation/interface/IBean';
import IScope from '../../annotation/interface/IScope';
import MethodBeanDefinition from '../../../beans/support/MethodBeanDefinition';
import PathUtils from '../../../common/utils/PathUtils';

// const __dirname = PathUtils.getDirnameByURL(import.meta.url);
const __mo_dispatcher = PathUtils.resolve(__dirname, '../../../');

/**
 * 容器配置
 */
type ContextConfig = {
    /** 基础目录路径 */
    basePath: string;
};

/**
 * 通用应用
 */
class GenericApplicationContext extends AbstractApplicationContext {
    /** 容器配置 */
    protected config: ContextConfig = { basePath: '' };

    /** Bean工厂 */
    protected beanFactory: DefaultListableBeanFactory | undefined;

    /**
     * @param configClass 配置类
     */
    constructor(configClass?: Class) {
        super();
        if (configClass) {
            const componentScanDecorator = DecoratorUtils.getDecorator(configClass, ComponentScan)[0];
            if (componentScanDecorator) {
                this.config.basePath = componentScanDecorator.metadata.value;
            }
        }
    }

    /**
     * 初始化应用
     */
    protected async initApplication(): Promise<void> {
        if (this.config.basePath.trim() === '') {
            throw new Error("'basePath' not initialized");
        }
        const beanFactory = this.getBeanFactory();
        // 扫描目录获取组件定义
        const filePaths = FileUtils.listFileAllSync(this.config.basePath).filter(
            (item) => item.endsWith('.js') && !item.startsWith(__mo_dispatcher) && item.indexOf('node_modules') === -1
        );
        for (let filePath of filePaths) {
            // 处理导入路径
            filePath = PathUtils.relative(__dirname, filePath);
            if (PathUtils.sep !== '/') {
                filePath = filePath.replace(/\\/g, '/');
            }

            // 导入组件模块
            const _export = await import(filePath).then((module): Class => module.default);
            if (!_export) {
                continue;
            }

            // 获取组件装饰器
            const componentDecorator = DecoratorUtils.getDecorator(_export, Component)[0];
            if (!componentDecorator) {
                continue;
            }

            // 创建组件类默认Bean定义
            const beanClassName = this.getBeanClassName(filePath);
            const beanName = componentDecorator.metadata.value || Introspector.decapitalize(_export.name);
            const beanDefinition = this.createDefaultBeanDefinition(beanName, beanClassName, _export);
            beanFactory.registerBeanDefinition(beanName, beanDefinition);

            // 创建配置类方法Bean定义
            if (componentDecorator instanceof Configuration) {
                const prototype = _export.prototype;
                const beanDecorators = DecoratorUtils.getDecorator(prototype, Bean, DecoratorType.METHOD);
                if (beanDecorators.length > 0) {
                    const scopeDecorators = DecoratorUtils.getDecorator(prototype, Scope, DecoratorType.METHOD);
                    const scopeDecoratorMap = new Map<string, IScope>();
                    for (const scopeDecorator of scopeDecorators) {
                        scopeDecoratorMap.set(<string>scopeDecorator.metadata.key, scopeDecorator);
                    }
                    for (const beanDecorator of beanDecorators) {
                        const subBeanName = beanDecorator.metadata.value || beanDecorator.metadata.key;
                        const scopeDecorator = scopeDecoratorMap.get(beanDecorator.metadata.key);
                        const subBeanDefinition = this.createMethodBeanDefinition(
                            subBeanName,
                            beanName,
                            beanClassName,
                            beanDecorator,
                            scopeDecorator
                        );
                        beanFactory.registerBeanDefinition(subBeanName, subBeanDefinition);
                    }
                }
            }
        }
    }

    /**
     * 刷新应用
     */
    protected onRefresh(): void {}

    /**
     * 设置基础路径
     *
     * @param basePath 基础路径
     */
    public setBasePath(basePath: string): void {
        if (!basePath || basePath.trim() === '') {
            throw new Error("'basePath' is empty");
        }
        if (!PathUtils.isAbsolute(basePath)) {
            throw new Error("'basePath' must be absolute");
        }
        this.config.basePath = basePath;
    }

    /**
     * 获取Bean工厂
     */
    public getBeanFactory(): DefaultListableBeanFactory {
        return (this.beanFactory ??= new DefaultListableBeanFactory());
    }

    /**
     * 获取BeanClass名称
     *
     * @param filePath 文件路径
     */
    protected getBeanClassName(filePath: string): string {
        let fileRelativePath = PathUtils.resolve(__dirname, filePath).substring(this.config.basePath.length);
        fileRelativePath = fileRelativePath.substring(
            fileRelativePath[0] === PathUtils.sep ? 1 : 0,
            fileRelativePath.lastIndexOf('.js')
        );
        let prefix = '';
        let fileName = fileRelativePath;
        const index = fileRelativePath.lastIndexOf(PathUtils.sep);
        if (index !== -1) {
            prefix = fileRelativePath.substring(0, index + 1);
            fileName = fileRelativePath.substring(index + 1);
        }
        fileName = fileName.replace(/(\..)/g, ($0) => $0[1].toUpperCase());
        const pathSepRegExp = new RegExp(PathUtils.sep === '/' ? '/' : '\\\\', 'g');
        return (prefix + fileName).replace(pathSepRegExp, '.');
    }

    /**
     * 创建默认Bean定义
     *
     * @param beanName Bean名称
     * @param beanClassName Bean类名
     * @param beanClass Bean类
     */
    private createDefaultBeanDefinition(beanName: string, beanClassName: string, beanClass: Class): BeanDefinition {
        this.validateBeanDefinition(beanName, beanClassName);
        const beanScope = DecoratorUtils.getDecorator(beanClass, Scope)[0]?.metadata.value;
        return new DefaultBeanDefinition(beanClassName, beanClass, beanScope);
    }

    /**
     * 创建方法Bean定义
     *
     * @param beanName Bean名称
     * @param factoryBeanName 工厂Bean名称
     * @param factoryBeanClassName 工厂Bean类名
     * @param beanDecorator Bean装饰器
     * @param scopeDecorator Scope装饰器
     */
    private createMethodBeanDefinition(
        beanName: string,
        factoryBeanName: string,
        factoryBeanClassName: string,
        beanDecorator: IBean,
        scopeDecorator?: IScope
    ): BeanDefinition {
        const factoryMethodName = beanDecorator.metadata.key;
        const beanClassName = `${factoryBeanClassName}#${factoryMethodName}`;
        this.validateBeanDefinition(beanName, beanClassName);
        const beanScope = scopeDecorator?.metadata.value;
        return new MethodBeanDefinition(beanClassName, factoryBeanName, factoryMethodName, beanScope);
    }

    /**
     * 校验Bean定义
     *
     * @param beanName Bean名称
     * @param beanClassName Bean类名
     */
    private validateBeanDefinition(beanName: string, beanClassName: string): void {
        const existingBeanDefinition = this.getBeanFactory().getBeanDefinition(beanName);
        if (existingBeanDefinition) {
            const existingBeanClassName = existingBeanDefinition.getBeanClassName();
            throw new ConflictingBeanDefinitionError(beanName, existingBeanClassName, beanClassName);
        }
    }
}

export default GenericApplicationContext;
