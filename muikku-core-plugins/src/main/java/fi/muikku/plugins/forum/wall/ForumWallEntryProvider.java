package fi.muikku.plugins.forum.wall;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.forum.dao.ForumMessageDAO;
import fi.muikku.plugins.forum.dao.ForumThreadDAO;
import fi.muikku.plugins.forum.dao.ForumThreadReplyDAO;
import fi.muikku.plugins.forum.model.ForumArea;
import fi.muikku.plugins.forum.model.ForumMessage;
import fi.muikku.plugins.forum.model.ForumThread;
import fi.muikku.plugins.forum.model.ForumThreadReply;
import fi.muikku.plugins.wall.WallController;
import fi.muikku.plugins.wall.WallEntryProvider;
import fi.muikku.plugins.wall.WallFeedItem;
import fi.muikku.plugins.wall.model.UserWall;
import fi.muikku.plugins.wall.model.Wall;
import fi.muikku.plugins.wall.model.WorkspaceWall;
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
  private WallController wallController;
  
  @Inject
  private ForumThreadDAO forumThreadDAO;

  @Inject
  private ForumThreadReplyDAO forumThreadReplyDAO;

  @Inject
  private ForumAreaSubscriptionDAO forumAreaSubscriptionDAO;

  @Inject
  private ForumThreadSubscriptionDAO forumThreadSubscriptionDAO;

  @Inject
  private ForumMessageDAO forumMessageDAO;
  
  @Override
  public List<WallFeedItem> listWallEntryItems(Wall wall) {
    // TODO ForumArea Rights, ForumController??, Duplicates when both types of subs
    
    List<WallFeedItem> feedItems = new ArrayList<WallFeedItem>();

    UserEntity loggedUser = sessionController.isLoggedIn() ? sessionController.getUser() : null;

    switch (wall.getWallType()) {
      case USER:
        /**
         * UserWall will list
         *  - Threads by subscriptions if the logged user is viewing his own wall
         *  - Threads the wall owner has contributed in (if accessible by viewer)
         */
        
        UserWall userWall = wallController.findUserWallById(wall.getId());
        
        if (userWall != null) {
          // User will see his own "subscriptions" but other users cannot see them
          if (userWall.getUser().equals(loggedUser.getId())) {
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
          }

          // Posts
          List<ForumMessage> contributedThreads = forumMessageDAO.listByContributingUser(loggedUser);

          for (ForumMessage contributedThread : contributedThreads) {
            feedItems.add(new UserFeedForumMessageItem(contributedThread));
          }
        }
      break;
      
      case ENVIRONMENT:
        
      break;
      
      case WORKSPACE:
        /**
         * WorkspaceWall will list
         *  - Forum area threads in workspace 
         */
        
        WorkspaceWall workspaceWall = wallController.findWorkspaceWallById(wall.getId());
        WorkspaceEntity workspace = workspaceController.findWorkspaceEntityById(workspaceWall.getWorkspace());
        
        List<ForumMessage> workspaceMessages = forumMessageDAO.listByWorkspace(workspace);
        for (ForumMessage workspaceMessage : workspaceMessages) {
          feedItems.add(new UserFeedForumMessageItem(workspaceMessage));
        }
      break;
    }
    
    return feedItems;
  }

  @Override
  public List<String> listRequiredJavaScripts() {
    return Arrays.asList(
        "scripts/gui/forumwallentries.js"
    );
  }

}
