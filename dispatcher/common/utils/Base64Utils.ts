/**
 * Base64工具类
 */
class Base64Utils {
    /**
     * Base64编码
     *
     * @param str 字符串
     */
    public static encode(str: string): string {
        return Buffer.from(str).toString('base64');
    }

    /**
     * Base64解码
     *
     * @param str 字符串
     */
    public static decode(str: string): string {
        return Buffer.from(str, 'base64').toString();
    }
}

export default Base64Utils;
