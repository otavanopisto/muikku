package fi.muikku.rest;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

import fi.muikku.plugin.manager.PluginManagerException;
import fi.muikku.plugin.manager.SingletonPluginManager;
import fi.muikku.rest.course.CourseRESTService;
import fi.muikku.rest.user.UserGroupRESTService;
import fi.muikku.rest.user.UserRESTService;
import fi.muikku.rest.user.UsersRESTService;

@ApplicationPath("/rest")
public class JaxRsActivator extends Application {

	public JaxRsActivator() {
		super();
	
		// TODO: There is probably more sophisticated way to do this (extending deployment scanner or something...)
		
		List<Class<? extends AbstractRESTService>> coreServices = Arrays.asList(
				PermissionRESTService.class,
				CourseRESTService.class,
				UserRESTService.class,
				UsersRESTService.class,
				TagRESTService.class,
				UserGroupRESTService.class
		);
		
		classes = new HashSet<>();
		classes.addAll(coreServices);
		
		try {
			classes.addAll(SingletonPluginManager.getInstance().getRESTServices());
		} catch (PluginManagerException e) {
			throw new ExceptionInInitializerError(e);
		}
		
		singletons = new HashSet<>();
		singletons.add(new ContextInterceptor());
	}
	
	@Override
	public Set<Class<?>> getClasses() {
		return classes;
	}
	
	@Override
	public Set<Object> getSingletons() {
		return singletons;
	}
	
	private Set<Class<?>> classes;
	private Set<Object> singletons;
}
