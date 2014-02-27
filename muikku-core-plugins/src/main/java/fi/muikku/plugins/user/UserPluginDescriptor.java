package fi.muikku.plugins.user;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.ResourceBundle;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;

import org.apache.commons.lang3.LocaleUtils;

import fi.muikku.i18n.LocaleBundle;
import fi.muikku.i18n.LocaleLocation;
import fi.muikku.plugin.LocalizedPluginDescriptor;
import fi.muikku.plugin.PersistencePluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class UserPluginDescriptor implements PluginDescriptor, PersistencePluginDescriptor, LocalizedPluginDescriptor {

	@Override
	public String getName() {
		return "user";
	}
	
	@Override
	public void init() {
	}

	@Override
	public List<Class<?>> getBeans() {
		return Collections.unmodifiableList(Arrays.asList(new Class<?>[] { 
			
			/* Controllers */

		  UserInfoController.class,
				
			/* Backing beans */ 
				
			UserIndexBackingBean.class,
			UserEmailChangeBackingBean.class,
			ConfirmEmailChangeBackingBean.class,
			EditUserInfoBackingBean.class,
			
			/* Request Handlers */
			
			/* DAOs */
			
			UserPendingEmailChangeDAO.class
		}));
	}
	
	@Override
	public Class<?>[] getEntities() {
		return new Class<?>[] {
		    UserPendingEmailChange.class
		};
	}

  @Override
  public List<LocaleBundle> getLocaleBundles() {
    List<LocaleBundle> bundles = new ArrayList<LocaleBundle>();
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.user.UserPluginMessages", LocaleUtils.toLocale("fi"))));
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.user.UserPluginMessages", LocaleUtils.toLocale("en"))));
    return bundles;
  }

}
