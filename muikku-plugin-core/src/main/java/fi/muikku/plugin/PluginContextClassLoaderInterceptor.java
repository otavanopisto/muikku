package fi.muikku.plugin;

import java.io.Serializable;

import javax.inject.Inject;
import javax.interceptor.AroundInvoke;
import javax.interceptor.Interceptor;
import javax.interceptor.InvocationContext;

@PluginContextClassLoader
@Interceptor
public class PluginContextClassLoaderInterceptor implements Serializable {
	
	private static final long serialVersionUID = 8069776856368249374L;
	
	@Inject
	@PluginClassLoader
	private ClassLoader pluginClassLoader;

	@AroundInvoke
  public Object aroundInvoke(InvocationContext ctx) throws Exception {
		ClassLoader currentClassLoader = Thread.currentThread().getContextClassLoader();
		try {
			Thread.currentThread().setContextClassLoader(pluginClassLoader);
  		return ctx.proceed();
		} finally {
			Thread.currentThread().setContextClassLoader(currentClassLoader);
		}
	}
}