package fi.muikku.plugins.forum.wall;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.forum.dao.ForumThreadDAO;
import fi.muikku.plugins.forum.dao.ForumThreadReplyDAO;
import fi.muikku.plugins.forum.model.ForumArea;
import fi.muikku.plugins.forum.model.ForumThread;
import fi.muikku.plugins.forum.model.ForumThreadReply;
import fi.muikku.plugins.wall.WallFeedItem;
import fi.muikku.plugins.wall.WallEntryProvider;
import fi.muikku.plugins.wall.dao.UserWallDAO;
import fi.muikku.plugins.wall.model.Wall;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.session.SessionController;

public class ForumWallEntryProvider implements WallEntryProvider {

  @Inject
  private SessionController sessionController;

  @Inject
  private UserController userController;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private UserWallDAO userWallDAO;

  @Inject
  private ForumThreadDAO forumThreadDAO;

  @Inject
  private ForumThreadReplyDAO forumThreadReplyDAO;

  @Inject
  private ForumAreaSubscriptionDAO forumAreaSubscriptionDAO;

  @Inject
  private ForumThreadSubscriptionDAO forumThreadSubscriptionDAO;
  
  @Override
  public List<WallFeedItem> listWallEntryItems(Wall wall) {
    // TODO ForumArea Rights, ForumController??, Duplicates when both types of subs
    
    
    List<WallFeedItem> feedItems = new ArrayList<WallFeedItem>();

    UserEntity loggedUser = sessionController.isLoggedIn() ? sessionController.getUser() : null;
    
    List<ForumAreaSubscription> areaSubscriptions = forumAreaSubscriptionDAO.listByUser(loggedUser);
    List<ForumThreadSubscription> threadSubscriptions = forumThreadSubscriptionDAO.listByUser(loggedUser);

    for (ForumAreaSubscription forumAreaSubscription : areaSubscriptions) {
      ForumArea forumArea = forumAreaSubscription.getForumArea();
  
      List<ForumThread> forumThreads = forumThreadDAO.listByForumArea(forumArea);
  
      for (ForumThread thread : forumThreads) {
        List<ForumThreadReply> replies = forumThreadReplyDAO.listByForumThread(thread);
        feedItems.add(new UserFeedForumThreadItem(thread, replies));
      }
    }

    for (ForumThreadSubscription forumThreadSubscription : threadSubscriptions) {
      ForumThread forumThread = forumThreadSubscription.getForumThread();
  
      List<ForumThreadReply> replies = forumThreadReplyDAO.listByForumThread(forumThread);
      feedItems.add(new UserFeedForumThreadItem(forumThread, replies));
    }
    
    return feedItems;
  }

}
