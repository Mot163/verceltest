import mongoose from 'mongoose';

/**
 * 数据库工具
 */
const db = {
    /**
     * 数据库连接
     */
    connect: async () => {
        if (!process.env.MONGODB_URI) {
            throw new Error('please set env MONGODB_URI');
        }
        return await mongoose.connect(process.env.MONGODB_URI);
    },

    /**
     * 获取表模型
     *
     * @param tableName 表名
     * @param schemaConstruct 表结构对象
     * @returns 表模型
     */
    getModel: async (tableName: string, schemaConstruct: object) => {
        const schema = new mongoose.Schema(schemaConstruct);
        return mongoose.model(tableName, schema);
    }
};

export default db;
