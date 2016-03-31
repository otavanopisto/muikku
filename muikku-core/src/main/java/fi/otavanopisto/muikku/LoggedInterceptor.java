package fi.otavanopisto.muikku;

import java.io.Serializable;

import javax.interceptor.AroundInvoke;
import javax.interceptor.Interceptor;
import javax.interceptor.InvocationContext;

@Logged
@Interceptor
public class LoggedInterceptor implements Serializable{
	
	private static final long serialVersionUID = 2100243275459853306L;
	
	public LoggedInterceptor() {
	}

	@AroundInvoke
	public Object logMethodEntry(InvocationContext invocationContext) throws Exception {
		System.out.println("Entering method: " + invocationContext.getMethod().getName() + " in class " + invocationContext.getMethod().getDeclaringClass().getName());
	
		return invocationContext.proceed();
	}
}
