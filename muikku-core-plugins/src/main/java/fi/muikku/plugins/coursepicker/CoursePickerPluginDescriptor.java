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
public class CoursePickerPluginDescriptor implements PluginDescriptor, LocalizedPluginDescriptor {
	
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
    result.add(CoursePickerController.class);
    
    return result;
  }

  @Override
  public List<LocaleBundle> getLocaleBundles() {
    List<LocaleBundle> bundles = new ArrayList<LocaleBundle>();
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.coursepicker.CoursePickerPluginMessages", LocaleUtils.toLocale("fi"))));
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.coursepicker.CoursePickerPluginMessages", LocaleUtils.toLocale("en"))));
    bundles.add(new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.plugins.coursepicker.CoursePickerJsPluginMessages", LocaleUtils.toLocale("fi"))));
    bundles.add(new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.plugins.coursepicker.CoursePickerJsPluginMessages", LocaleUtils.toLocale("en"))));
    return bundles;
  }

}
