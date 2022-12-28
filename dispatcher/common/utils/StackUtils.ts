/**
 * 调用栈工具类
 */
class StackUtils {
    /**
     * 获取调用栈文件名列表
     */
    public static getStackFileNameList(): string[] {
        const origin = Error.prepareStackTrace;
        Error.prepareStackTrace = (__unuse__, stack) => stack;
        const error = new Error();
        const stack: Array<{ getFileName: () => string }> = (<any>error.stack).slice(1);
        Error.prepareStackTrace = origin;
        return stack.map((item) => item.getFileName());
    }
}

export default StackUtils;
