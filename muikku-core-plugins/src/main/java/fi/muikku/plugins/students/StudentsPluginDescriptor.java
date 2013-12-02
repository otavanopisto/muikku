package fi.muikku.plugins.students;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;

import fi.muikku.plugin.PersistencePluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class StudentsPluginDescriptor implements PluginDescriptor, PersistencePluginDescriptor {

	@Override
	public String getName() {
		return "students";
	}
	
	@Override
	public void init() {
	}

	@Override
	public List<Class<?>> getBeans() {
		return Collections.unmodifiableList(Arrays.asList(new Class<?>[] { 
			
			/* Controllers */
				
		  
			/* Backing beans */ 

		  StudentViewBackingBean.class
			
			/* Request Handlers */
			
			
			/* DAOs */
			
			
		}));
	}
	
	@Override
	public Class<?>[] getEntities() {
		return new Class<?>[] {
		};
	}

}
