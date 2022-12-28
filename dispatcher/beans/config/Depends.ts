/**
 * 依赖
 */
type Depend = {
    /** Bean属性名称 */
    key: string;
    /** 依赖Bean名称 */
    value: string;
};

/**
 * 依赖列表
 */
class Depends {
    /** 依赖列表 */
    private depends: Depend[];

    /**
     * @param depends 依赖
     */
    constructor(...depends: Depend[]) {
        this.depends = depends;
    }

    /**
     * 获取依赖Bean名称列表
     */
    public getDependBeanNames(): string[] {
        return this.depends.map((depend) => depend.value);
    }

    /**
     * 获取依赖列表
     */
    public getDepends(): Depend[] {
        return this.depends;
    }
}

export default Depends;
