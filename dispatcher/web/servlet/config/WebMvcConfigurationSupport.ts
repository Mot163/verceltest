import InterceptorRegistry from './InterceptorRegistry';

/**
 * Web配置
 */
class WebMvcConfigurationSupport {
    /**
     * 添加拦截器
     *
     * @param registry 拦截器注册器
     */
    public addInterceptors(registry: InterceptorRegistry): void {}
}

export default WebMvcConfigurationSupport;
