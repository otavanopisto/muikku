package fi.muikku.plugins.coursepicker;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;

import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class CoursePickerPluginDescriptor implements PluginDescriptor {//, PersistencePluginDescriptor, RESTPluginDescriptor {
	
	@Override
	public String getName() {
		return "coursepicker";
	}
	
	@Override
	public void init() {
	}

  @Override
  public List<Class<?>> getBeans() {
    return null;
  }

//	@Override
//	public List<Class<?>> getBeans() {
//		return new ArrayList<Class<?>>(Arrays.asList(
//			/* DAOs */	
//		  
//		  /* Controllers */
//
//		));
//	}
	
//	@Override
//	public Class<?>[] getEntities() {
//		return new Class<?>[] {
//			CommunicatorMessage.class,
//			CommunicatorMessageId.class,
//			CommunicatorMessageRecipient.class
//		};
//	}
//	
//	@Override
//	public Class<?>[] getRESTServices() {
//		return new Class<?>[] {
//			CommunicatorRESTService.class
//		};
//	}
}
