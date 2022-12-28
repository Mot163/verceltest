import UserMapper from '../mapper/UserMapper';

/**
 * 用户服务
 */
const UserService = {
    /**
     * 登录
     *
     * @param username 用户名
     * @param password 密码
     */
    login: (username: string, password: string) => {
        const user = UserMapper.selectUserByUsernameAndPassword(username, password);
        if (!user) {
            throw new Error('用户不存在!');
        }
        return user;
    }
};

export default UserService;
