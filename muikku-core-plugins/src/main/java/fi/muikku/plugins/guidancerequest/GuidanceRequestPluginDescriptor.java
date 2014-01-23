package fi.muikku.plugins.guidancerequest;

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
public class GuidanceRequestPluginDescriptor implements PluginDescriptor, PersistencePluginDescriptor, RESTPluginDescriptor {
	
	@Override
	public String getName() {
		return "guidancerequest";
	}
	
	@Override
	public void init() {
	}

	@Override
	public List<Class<?>> getBeans() {
		return new ArrayList<Class<?>>(Arrays.asList(
			/* DAOs */
		  GuidanceRequestDAO.class,
		  WorkspaceGuidanceRequestDAO.class,
		  
		  /* Controllers */
		  
		  GuidanceRequestController.class,
		  
		  /* Other */
		  
		  GuidanceRequestPermissions.class,
		  GuidanceRequestWallEntryProvider.class,
		  GuidanceRequestsBackingBean.class,
		  WorkspaceGuidanceRequestsBackingBean.class,
		  GuidanceRequestSeekerResultProvider.class
		));
	}
	
	@Override
	public Class<?>[] getEntities() {
		return new Class<?>[] {
      GuidanceRequest.class,
      WorkspaceGuidanceRequest.class
		};
	}
	
	@Override
	public Class<?>[] getRESTServices() {
		return new Class<?>[] {
		};
	}
}
