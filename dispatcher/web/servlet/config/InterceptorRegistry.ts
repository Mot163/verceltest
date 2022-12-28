import HandlerInterceptor from '../HandlerInterceptor';
import InterceptorRegistration from './InterceptorRegistration';

/**
 * 拦截器注册器
 */
class InterceptorRegistry {
    /** 拦截器记录列表 */
    private registrations = new Array<InterceptorRegistration>();

    /**
     * 添加拦截器
     *
     * @param interceptor 拦截器
     */
    public addInterceptor(interceptor: HandlerInterceptor): InterceptorRegistration {
        const registration = new InterceptorRegistration(interceptor);
        this.registrations.push(registration);
        return registration;
    }

    /**
     * 获取路径匹配的拦截器列表
     *
     * @param path 路径
     */
    public getMappingsInterceptors(path: string): HandlerInterceptor[] {
        return this.registrations
            .filter((registration) => registration.match(path))
            .sort((r1, r2) => r1.getOrder() - r2.getOrder())
            .map((registration) => registration.getInterceptor());
    }
}

export default InterceptorRegistry;
