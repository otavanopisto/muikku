package fi.muikku.plugins.wall;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;

import fi.muikku.plugin.PersistencePluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.RESTPluginDescriptor;
import fi.muikku.plugins.wall.dao.CourseWallDAO;
import fi.muikku.plugins.wall.dao.EnvironmentWallDAO;
import fi.muikku.plugins.wall.dao.ForumAreaSubscriptionDAO;
import fi.muikku.plugins.wall.dao.UserWallDAO;
import fi.muikku.plugins.wall.dao.UserWallSubscriptionDAO;
import fi.muikku.plugins.wall.dao.WallDAO;
import fi.muikku.plugins.wall.dao.WallEntryDAO;
import fi.muikku.plugins.wall.dao.WallEntryGuidanceRequestItemDAO;
import fi.muikku.plugins.wall.dao.WallEntryItemDAO;
import fi.muikku.plugins.wall.dao.WallEntryReplyDAO;
import fi.muikku.plugins.wall.dao.WallEntryTextItemDAO;
import fi.muikku.plugins.wall.dao.WallSubscriptionDAO;
import fi.muikku.plugins.wall.model.AbstractWallEntry;
import fi.muikku.plugins.wall.model.CourseWall;
import fi.muikku.plugins.wall.model.EnvironmentWall;
import fi.muikku.plugins.wall.model.ForumAreaSubscription;
import fi.muikku.plugins.wall.model.UserWall;
import fi.muikku.plugins.wall.model.UserWallSubscription;
import fi.muikku.plugins.wall.model.Wall;
import fi.muikku.plugins.wall.model.WallEntry;
import fi.muikku.plugins.wall.model.WallEntryGuidanceRequestItem;
import fi.muikku.plugins.wall.model.WallEntryItem;
import fi.muikku.plugins.wall.model.WallEntryReply;
import fi.muikku.plugins.wall.model.WallEntryTextItem;
import fi.muikku.plugins.wall.model.WallSubscription;
import fi.muikku.plugins.wall.rest.WallRESTService;

@ApplicationScoped
@Stateful
public class WallPluginDescriptor implements PluginDescriptor, PersistencePluginDescriptor, RESTPluginDescriptor {
	
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
      CourseWallDAO.class,
      EnvironmentWallDAO.class,
      ForumAreaSubscriptionDAO.class,
      UserWallDAO.class,
      UserWallSubscriptionDAO.class,
      WallDAO.class,
      WallEntryDAO.class,
      WallEntryGuidanceRequestItemDAO.class,
      WallEntryItemDAO.class,
      WallEntryReplyDAO.class,
      WallEntryTextItemDAO.class,
      WallSubscriptionDAO.class,
		  
		  /* Controllers */
		  WallController.class
		));
	}
	
	@Override
	public Class<?>[] getEntities() {
		return new Class<?>[] {
		  AbstractWallEntry.class,
      CourseWall.class,
      EnvironmentWall.class,
      ForumAreaSubscription.class,
      UserWall.class,
      UserWallSubscription.class,
      Wall.class,
      WallEntry.class,
      WallEntryGuidanceRequestItem.class,
      WallEntryItem.class,
      WallEntryReply.class,
      WallEntryTextItem.class,
      WallSubscription.class,
		};
	}
	
	@Override
	public Class<?>[] getRESTServices() {
		return new Class<?>[] {
			WallRESTService.class
		};
	}
}
