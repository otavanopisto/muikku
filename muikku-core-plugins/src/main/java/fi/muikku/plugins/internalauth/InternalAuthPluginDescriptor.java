package fi.muikku.plugins.internalauth;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;

import fi.muikku.plugin.PersistencePluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugins.internalauth.dao.InternalAuthDAO;
import fi.muikku.plugins.internalauth.model.InternalAuth;

@ApplicationScoped
@Stateful
public class InternalAuthPluginDescriptor implements PluginDescriptor, PersistencePluginDescriptor {

  @Override
  public String getName() {
    return "internalauth";
  }
  
  @Override
  public void init() {
  }

  @Override
  public List<Class<?>> getBeans() {
    return new ArrayList<Class<?>>(Arrays.asList(
    	
    	/* Controllers */
      
    	InternalAuthController.class,
    	
    	/* Authentication Sources */
    	
    	InternalAuthenticationStrategy.class,
      
    	/* DAOs*/
    	
    	InternalAuthDAO.class    
    ));
  }
  
  @Override
  public Class<?>[] getEntities() {
  	return new Class<?>[] {
  		InternalAuth.class
  	};
  }

}
