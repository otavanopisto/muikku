package fi.muikku.plugins.friends;

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
public class FriendsPluginDescriptor implements PluginDescriptor, PersistencePluginDescriptor, RESTPluginDescriptor {
	
	@Override
	public String getName() {
		return "forum";
	}
	
	@Override
	public void init() {
	}

	@Override
	public List<Class<?>> getBeans() {
		return new ArrayList<Class<?>>(Arrays.asList(
			/* DAOs */
		  FriendDAO.class,
		  FriendRequestDAO.class,
		  
		  /* Controllers */
		  FriendsController.class
		  
		  /* Other */
      
		));
	}
	
	@Override
	public Class<?>[] getEntities() {
		return new Class<?>[] {
		  Friend.class,
      FriendRequest.class
		};
	}
	
	@Override
	public Class<?>[] getRESTServices() {
		return new Class<?>[] {
		};
	}
}
