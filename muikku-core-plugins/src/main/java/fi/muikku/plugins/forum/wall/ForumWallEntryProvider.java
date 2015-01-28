package fi.muikku.plugins.forum.wall;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.forum.ForumController;
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
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.session.SessionController;
import fi.muikku.users.UserEntityController;

public class ForumWallEntryProvider implements WallEntryProvider {

  @Inject
  private SessionController sessionController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private WallController wallController;

  @Inject
  private ForumController forumController;
  
  @Inject
  private ForumAreaSubscriptionDAO forumAreaSubscriptionDAO;

  @Inject
  private ForumThreadSubscriptionDAO forumThreadSubscriptionDAO;

  @Override
  public List<WallFeedItem> listWallEntryItems(Wall wall) {
    // TODO ForumArea Rights, ForumController??, Duplicates when both types of subs
    
    List<WallFeedItem> feedItems = new ArrayList<WallFeedItem>();

    UserEntity loggedUser = sessionController.isLoggedIn() ? sessionController.getLoggedUserEntity() : null;

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
          if (sessionController.isLoggedIn() && userWall.getUser().equals(loggedUser.getId())) {
            List<ForumAreaSubscription> areaSubscriptions = forumAreaSubscriptionDAO.listByUser(loggedUser);
            List<ForumThreadSubscription> threadSubscriptions = forumThreadSubscriptionDAO.listByUser(loggedUser);
        
            for (ForumAreaSubscription forumAreaSubscription : areaSubscriptions) {
              ForumArea forumArea = forumAreaSubscription.getForumArea();
          
              List<ForumThread> forumThreads = forumController.listForumThreads(forumArea, 0, 25);
          
              for (ForumThread thread : forumThreads) {
                List<ForumThreadReply> replies = forumController.listForumThreadReplies(thread, 0, 25);
                feedItems.add(new UserFeedForumThreadItem(thread, replies));
              }
            }
        
            for (ForumThreadSubscription forumThreadSubscription : threadSubscriptions) {
              ForumThread forumThread = forumThreadSubscription.getForumThread();
          
              List<ForumThreadReply> replies = forumController.listForumThreadReplies(forumThread, 0, 25);
              feedItems.add(new UserFeedForumThreadItem(forumThread, replies));
            }
          }

          UserEntity wallUser = userEntityController.findUserEntityById(userWall.getUser());
          
          // TODO Rights to view the forum area
          // Posts
          List<ForumMessage> contributedThreads = forumController.listByContributingUser(wallUser);

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
        
        List<ForumMessage> workspaceMessages = forumController.listMessagesByWorkspace(workspace);
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
        "scripts/gui/forum_wallentry.js"
    );
  }

}
