package fi.muikku.plugins.forum;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;

import fi.muikku.plugin.PersistencePluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.RESTPluginDescriptor;
import fi.muikku.plugins.forum.dao.WorkspaceForumAreaDAO;
import fi.muikku.plugins.forum.dao.EnvironmentForumAreaDAO;
import fi.muikku.plugins.forum.dao.ForumAreaDAO;
import fi.muikku.plugins.forum.dao.ForumMessageDAO;
import fi.muikku.plugins.forum.dao.ForumThreadDAO;
import fi.muikku.plugins.forum.dao.ForumThreadReplyDAO;
import fi.muikku.plugins.forum.model.WorkspaceForumArea;
import fi.muikku.plugins.forum.model.EnvironmentForumArea;
import fi.muikku.plugins.forum.model.ForumArea;
import fi.muikku.plugins.forum.model.ForumMessage;
import fi.muikku.plugins.forum.model.ForumThread;
import fi.muikku.plugins.forum.model.ForumThreadReply;
import fi.muikku.plugins.forum.wall.ForumAreaSubscription;
import fi.muikku.plugins.forum.wall.ForumAreaSubscriptionDAO;
import fi.muikku.plugins.forum.wall.ForumThreadSubscription;
import fi.muikku.plugins.forum.wall.ForumThreadSubscriptionDAO;
import fi.muikku.plugins.forum.wall.ForumWallEntryProvider;

@ApplicationScoped
@Stateful
public class ForumPluginDescriptor implements PluginDescriptor, PersistencePluginDescriptor, RESTPluginDescriptor {
	
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
		  WorkspaceForumAreaDAO.class,
      EnvironmentForumAreaDAO.class,
      ForumAreaDAO.class,
      ForumMessageDAO.class,
      ForumThreadDAO.class,
      ForumThreadReplyDAO.class,
      ForumAreaSubscriptionDAO.class,
      ForumThreadSubscriptionDAO.class,
		  
		  /* Controllers */
		  ForumController.class,
		  
		  /* Other */
      ForumPermissionResolver.class,
		  ForumResourcePermissionCollection.class,
		  
		  ForumWallEntryProvider.class
		));
	}
	
	@Override
	public Class<?>[] getEntities() {
		return new Class<?>[] {
      WorkspaceForumArea.class,
      EnvironmentForumArea.class,
      ForumArea.class,
      ForumMessage.class,
      ForumThread.class,
      ForumThreadReply.class,
      ForumAreaSubscription.class,
      ForumThreadSubscription.class
		};
	}
	
	@Override
	public Class<?>[] getRESTServices() {
		return new Class<?>[] {
//			CommunicatorRESTService.class
		};
	}
}
