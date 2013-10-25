package fi.muikku.plugins.assessmentrequest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;

import fi.muikku.plugin.PersistencePluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.RESTPluginDescriptor;

@ApplicationScoped
@Stateful
public class AssessmentRequestPluginDescriptor implements PluginDescriptor, PersistencePluginDescriptor, RESTPluginDescriptor {
	
	@Override
	public String getName() {
		return "assessmentrequest";
	}
	
	@Override
	public void init() {
	}

	@Override
	public List<Class<?>> getBeans() {
		return new ArrayList<Class<?>>(Arrays.asList(
			/* DAOs */
		  AssessmentRequestDAO.class,
		  
		  /* Controllers */
		  
		  AssessmentRequestController.class,
		  
		  /* Other */
		  
		  AssessmentRequestPermissions.class,
		  AssessmentRequestWallEntryProvider.class
		));
	}
	
	@Override
	public Class<?>[] getEntities() {
		return new Class<?>[] {
      AssessmentRequest.class,
		};
	}
	
	@Override
	public Class<?>[] getRESTServices() {
		return new Class<?>[] {
//			CommunicatorRESTService.class
		};
	}
}
