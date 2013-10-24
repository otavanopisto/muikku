package fi.muikku.plugins.courselist;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;

import fi.muikku.plugin.PersistencePluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class CourseListPluginDescriptor implements PluginDescriptor, PersistencePluginDescriptor {
	
	@Override
	public String getName() {
		return "courselist";
	}
	
	@Override
	public void init() {
	}

  @Override
  public Class<?>[] getEntities() {
    return new Class<?>[] {
        CourseListSelection.class,
        UserFavouriteWorkspace.class,
    };
  }

  @Override
  public List<Class<?>> getBeans() {
    List<Class<?>> result = new ArrayList<Class<?>>();
    
    result.add(CourseListBackingBean.class);
    result.add(CourseListSelectionDAO.class);
    result.add(UserFavouriteWorkspaceDAO.class);
    
    return result;
  }

}
