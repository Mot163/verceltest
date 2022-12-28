import UserSchema from '../schema/UserSchema';
import db from '../utils/db';

/**
 * 用户数据访问
 */
const UserMapper = {
    selectUserByUsernameAndPassword: async (username: string, password: string) => {
        await db.connect();
        const userModel = await db.getModel('s_user', UserSchema);
        return await userModel.findOne({ username, password });
    }
};

export default UserMapper;
