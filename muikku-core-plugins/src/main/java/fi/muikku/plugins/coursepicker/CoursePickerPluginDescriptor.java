package fi.muikku.plugins.coursepicker;

import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;

import org.apache.commons.lang3.LocaleUtils;

import fi.muikku.i18n.LocaleBundle;
import fi.muikku.i18n.LocaleLocation;
import fi.muikku.plugin.LocalizedPluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class CoursePickerPluginDescriptor implements PluginDescriptor, LocalizedPluginDescriptor {//, PersistencePluginDescriptor, RESTPluginDescriptor {
	
	@Override
	public String getName() {
		return "coursepicker";
	}
	
	@Override
	public void init() {
	}

  @Override
  public List<Class<?>> getBeans() {
    List<Class<?>> result = new ArrayList<Class<?>>();
    
    result.add(CoursePickerSeekerResultProvider.class);
    
    return result;
  }

  @Override
  public List<LocaleBundle> getLocaleBundles() {
    List<LocaleBundle> bundles = new ArrayList<LocaleBundle>();
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.coursepicker.CoursePickerPluginMessages", LocaleUtils.toLocale("fi"))));
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.coursepicker.CoursePickerPluginMessages", LocaleUtils.toLocale("en"))));
    return bundles;
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
