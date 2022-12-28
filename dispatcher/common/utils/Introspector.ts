/**
 * 内省工具类
 */
class Introspector {
    /**
     * 名称头部处理
     *
     * @param name 名称
     */
    public static decapitalize(name: string) {
        if (name === null || name.length === 0) {
            return name;
        }
        if (name.length > 1 && name[0].toUpperCase() === name[0] && name[1].toUpperCase() === name[1]) {
            return name;
        }
        return name.replace(/(.)/, ($0) => $0.toLowerCase());
    }
}

export default Introspector;
