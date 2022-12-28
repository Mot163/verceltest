/**
 * 使用装饰器错误
 */
class UsingDecoratorError extends Error {
    /**
     * @param message 错误信息
     */
    constructor(message: string) {
        super(message);
        this.name = 'UsingDecoratorError';
    }
}

export default UsingDecoratorError;
