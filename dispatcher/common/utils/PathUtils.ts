import Path from 'path';
import { fileURLToPath } from 'url';

/**
 * 路径工具类
 */
class PathUtils {
    /** 当前系统环境路径分隔符 */
    public static sep = Path.sep;

    /**
     * 迭代解析 paths 为绝对路径
     *
     * @param paths 路径
     */
    public static resolve(...paths: string[]): string {
        return Path.resolve(...paths);
    }

    /**
     * 获取从 from 到 to 的相对路径
     *
     * @param from 源路径
     * @param to 目标路径
     */
    public static relative(from: string, to: string): string {
        return Path.relative(from, to);
    }

    /**
     * 判断参数 path 是否是绝对路径
     *
     * @param path 路径
     */
    public static isAbsolute(path: string): boolean {
        return Path.isAbsolute(path);
    }

    /**
     * 将文件地址转换为路径
     *
     * @param fileURL 文件地址
     */
    public static fileURLToPath(fileURL: string): string {
        return fileURLToPath(fileURL);
    }

    /**
     * 通过文件路径获取当前文件目录路径
     *
     * @param filePath 文件路径
     */
    public static getDirnameByPath(filePath: string): string {
        return Path.dirname(filePath);
    }

    /**
     * 通过文件地址获取当前文件目录路径
     *
     * @param fileURL 文件地址
     */
    public static getDirnameByURL(fileURL: string): string {
        return Path.dirname(fileURLToPath(fileURL));
    }
}

export default PathUtils;
