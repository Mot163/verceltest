import fs from 'fs';
import PathUtils from './PathUtils';

/**
 * 文件工具类
 */
class FileUtils {
    /**
     * 是否为文件
     *
     * @param path 文件路径
     */
    public static isFile(path: string): boolean {
        return fs.statSync(path).isFile();
    }

    /**
     * 是否为目录
     *
     * @param path 文件路径
     */
    public static isDirectory(path: string): boolean {
        return fs.statSync(path).isDirectory();
    }

    /**
     * 列出所有文件（异步）
     *
     * @param path 文件路径
     * @returns 文件路径列表
     */
    public static async listFileAll(path: string): Promise<string[]> {
        path = PathUtils.isAbsolute(path) ? path : PathUtils.resolve(path);
        if (FileUtils.isFile(path)) {
            return [path];
        }
        const list: string[] | PromiseLike<string[]> = [];
        return await new Promise((resolve, reject) => {
            fs.readdir(path, async (error, files) => {
                files = files.map((file) => PathUtils.resolve(path, file));
                if (error) {
                    reject(error);
                }
                while (files.length) {
                    const file = <string>files.pop();
                    const absolute = PathUtils.resolve(path, file);
                    if (FileUtils.isFile(absolute)) {
                        list.push(absolute);
                    } else {
                        const subFiles = await new Promise((res: (files: string[]) => void, rej) => {
                            fs.readdir(absolute, (error, files) => {
                                files = files.map((file) => PathUtils.resolve(path, file));
                                if (error) {
                                    rej(error);
                                }
                                res(files);
                            });
                        });
                        files.push(...subFiles);
                    }
                }
                resolve(list);
            });
        });
    }

    /**
     * 列出所有文件（同步）
     *
     * @param path 文件路径
     * @returns 文件路径列表
     */
    public static listFileAllSync(path: string): string[] {
        path = PathUtils.isAbsolute(path) ? path : PathUtils.resolve(path);
        if (FileUtils.isFile(path)) {
            return [path];
        }
        const list = new Array<string>();
        const files = fs.readdirSync(path).map((file) => PathUtils.resolve(path, file));
        while (files.length) {
            const file = <string>files.pop();
            if (FileUtils.isFile(file)) {
                list.push(file);
            } else {
                const subFiles = fs.readdirSync(file).map((subFile) => PathUtils.resolve(file, subFile));
                files.push(...subFiles);
            }
        }
        return list;
    }
}

export default FileUtils;
