/**
 * 用户
 */
const UserSchema = {
    // 昵称
    nickname: {
        type: String,
        trim: true,
        maxlength: 128
    },

    // 用户名
    username: {
        required: true,
        type: String,
        trim: true,
        maxlength: 128
    },

    // 密码
    password: {
        required: true,
        type: String,
        trim: true,
        minlength: 8,
        maxlength: 16
    },

    // 头像
    avatar: {
        type: String,
        trim: true,
        maxlength: 256
    },

    // 是否为管理员
    is_admin: {
        type: Boolean,
        default: false
    },

    // 上次登录时间
    last_login_time: Date,

    // 状态(0: 禁用; 1: 启用)
    status: {
        type: Number,
        default: 1
    },

    // 创建时间
    create_time: {
        type: Date,
        default: new Date()
    },

    // 更新时间
    update_time: {
        type: Date,
        default: new Date()
    }
};

export default UserSchema;
