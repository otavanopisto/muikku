package fi.muikku.plugins.wall;

import java.util.ArrayList;
import java.util.Arrays;
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
import fi.muikku.plugin.RESTPluginDescriptor;
import fi.muikku.plugins.wall.dao.EnvironmentWallDAO;
import fi.muikku.plugins.wall.dao.UserWallDAO;
import fi.muikku.plugins.wall.dao.UserWallSubscriptionDAO;
import fi.muikku.plugins.wall.dao.WallDAO;
import fi.muikku.plugins.wall.dao.WallEntryDAO;
import fi.muikku.plugins.wall.dao.WallEntryReplyDAO;
import fi.muikku.plugins.wall.dao.WorkspaceWallDAO;
import fi.muikku.plugins.wall.impl.DefaultWallEntryProvider;
import fi.muikku.plugins.wall.model.AbstractWallEntry;
import fi.muikku.plugins.wall.model.EnvironmentWall;
import fi.muikku.plugins.wall.model.UserWall;
import fi.muikku.plugins.wall.model.UserWallSubscription;
import fi.muikku.plugins.wall.model.Wall;
import fi.muikku.plugins.wall.model.WallEntry;
import fi.muikku.plugins.wall.model.WallEntryReply;
import fi.muikku.plugins.wall.model.WorkspaceWall;
import fi.muikku.plugins.wall.rest.WallRESTService;

@ApplicationScoped
@Stateful
public class WallPluginDescriptor implements PluginDescriptor, LocalizedPluginDescriptor, PersistencePluginDescriptor, RESTPluginDescriptor {
	
	@Override
	public String getName() {
		return "wall";
	}
	
	@Override
	public void init() {
	}

	@Override
	public List<Class<?>> getBeans() {
		return new ArrayList<Class<?>>(Arrays.asList(
			/* DAOs */	
      WorkspaceWallDAO.class,
      EnvironmentWallDAO.class,
      UserWallDAO.class,
      UserWallSubscriptionDAO.class,
      WallDAO.class,
      WallEntryDAO.class,
      WallEntryReplyDAO.class,
      
		  /* Controllers */
		  WallController.class,
		  
		  /* Other */
		  DefaultWallEntryProvider.class
		));
	}
	
	@Override
	public Class<?>[] getEntities() {
		return new Class<?>[] {
		  AbstractWallEntry.class,
      WorkspaceWall.class,
      EnvironmentWall.class,
      UserWall.class,
      UserWallSubscription.class,
      Wall.class,
      WallEntry.class,
      WallEntryReply.class,
		};
	}
	
	@Override
	public Class<?>[] getRESTServices() {
		return new Class<?>[] {
			WallRESTService.class
		};
	}

	@Override
  public List<LocaleBundle> getLocaleBundles() {
    List<LocaleBundle> bundles = new ArrayList<LocaleBundle>();
    bundles.add(new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.plugins.wall.WallJsPluginMessages", LocaleUtils.toLocale("fi"))));
    bundles.add(new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.plugins.wall.WallJsPluginMessages", LocaleUtils.toLocale("en"))));
    return bundles;
  }
}
