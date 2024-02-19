package fi.otavanopisto.muikku.plugins.forum;

import java.util.List;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.forum.dao.ForumThreadDAO;
import fi.otavanopisto.muikku.plugins.forum.dao.WorkspaceForumAreaDAO;
import fi.otavanopisto.muikku.plugins.forum.model.ForumThread;
import fi.otavanopisto.muikku.plugins.forum.model.WorkspaceForumArea;
import fi.otavanopisto.muikku.plugins.forum.wall.ForumThreadSubscription;
import fi.otavanopisto.muikku.plugins.forum.wall.ForumThreadSubscriptionDAO;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceUserRemovedEvent;
import fi.otavanopisto.muikku.users.UserEntityController;

public class ForumThreadSubsciptionController {

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private ForumThreadSubscriptionDAO forumThreadSubscriptionDAO;

  @Inject
  private WorkspaceForumAreaDAO workspaceForumAreaDAO;

  @Inject
  private ForumThreadDAO forumThreadDAO;
  
  public void removeThreadSubscriptions(UserEntity userEntity) {
    List<ForumThreadSubscription> subscriptions = listByUser(userEntity);
    for (ForumThreadSubscription subscription : subscriptions) {
      deleteSubscription(subscription);
    }
  }

  public void removeThreadSubscriptions(UserEntity userEntity, WorkspaceEntity workspaceEntity) {
    List<ForumThreadSubscription> subscriptions = listByUser(userEntity);
    if (subscriptions.isEmpty()) {
      return;
    }
    List<WorkspaceForumArea> areas = workspaceForumAreaDAO.listByWorkspaceEntity(workspaceEntity);
    for (WorkspaceForumArea area : areas) {
      List<ForumThread> threads = forumThreadDAO.listByForumArea(area);
      for (ForumThreadSubscription subscription : subscriptions) {
        if (threads.stream().filter(t -> t.getId().equals(subscription.getForumThread().getId())).findFirst().orElse(null) != null) { 
          deleteSubscription(subscription);
        }
      }
    }
  }

  public ForumThreadSubscription createForumThreadSubsciption(ForumThread forumThread, UserEntity userEntity) {
    return forumThreadSubscriptionDAO.create(userEntity, forumThread);
  }
  
  public ForumThreadSubscription findByThreadAndUserEntity(ForumThread forumThread, UserEntity userEntity) {
    return forumThreadSubscriptionDAO.findByUserAndForumThread(userEntity, forumThread);
  }
  
  public void deleteSubscription(ForumThreadSubscription forumThreadSubscription) {
    forumThreadSubscriptionDAO.delete(forumThreadSubscription);
  }
  
  public List<ForumThreadSubscription> listByThread(ForumThread forumThread){
    return forumThreadSubscriptionDAO.listByThread(forumThread);
  }
  
  public List<ForumThreadSubscription> listByUser(UserEntity userEntity){
    return forumThreadSubscriptionDAO.listByUser(userEntity);
  }

  /**
   * When a workspace user (student or staff) is removed, remove all of their workspace discussion area thread subscriptions
   * 
   * @param event Workspace user removed event
   */
  public void onSchoolDataWorkspaceUserRemovedEvent(@Observes SchoolDataWorkspaceUserRemovedEvent event) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(event.getWorkspaceDataSource(), event.getWorkspaceIdentifier());
    UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(event.getUserDataSource(), event.getUserIdentifier());
    if (workspaceEntity != null && userEntity != null) {
      removeThreadSubscriptions(userEntity, workspaceEntity);
    }
  }
  
}
