package fi.otavanopisto.muikku.plugins.forum;

import java.util.List;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.forum.dao.WorkspaceForumAreaDAO;
import fi.otavanopisto.muikku.plugins.forum.model.ForumArea;
import fi.otavanopisto.muikku.plugins.forum.model.WorkspaceForumArea;
import fi.otavanopisto.muikku.plugins.forum.wall.ForumAreaSubscription;
import fi.otavanopisto.muikku.plugins.forum.wall.ForumAreaSubscriptionDAO;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceUserRemovedEvent;
import fi.otavanopisto.muikku.users.UserEntityController;

public class ForumAreaSubsciptionController {
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private ForumAreaSubscriptionDAO forumAreaSubscriptionDAO;
  
  @Inject
  private WorkspaceForumAreaDAO workspaceForumAreaDAO;
  
  public void removeAreaSubscriptions(UserEntity userEntity) {
    List<ForumAreaSubscription> subscriptions = listByUser(userEntity);
    for (ForumAreaSubscription subscription : subscriptions) {
      deleteSubscription(subscription);
    }
  }

  public void removeAreaSubscriptions(UserEntity userEntity, WorkspaceEntity workspaceEntity) {
    List<ForumAreaSubscription> subscriptions = listByUser(userEntity);
    if (subscriptions.isEmpty()) {
      return;
    }
    List<WorkspaceForumArea> areas = workspaceForumAreaDAO.listByWorkspaceEntity(workspaceEntity);
    for (ForumAreaSubscription subscription : subscriptions) {
      if (areas.stream().filter(a -> a.getId().equals(subscription.getForumArea().getId())).findFirst().orElse(null) != null) {
        deleteSubscription(subscription);
      }
    }
  }
  
  public ForumAreaSubscription createForumAreaSubsciption(ForumArea forumArea, UserEntity userEntity) {
    return forumAreaSubscriptionDAO.create(userEntity, forumArea);
  }
  
  public ForumAreaSubscription findByAreaAndUserEntity(ForumArea forumArea, UserEntity userEntity) {
    return forumAreaSubscriptionDAO.findByUserAndForumArea(userEntity, forumArea);
  }
  
  public void deleteSubscription(ForumAreaSubscription forumAreaSubscription) {
    forumAreaSubscriptionDAO.delete(forumAreaSubscription);
  }
  
  public List<ForumAreaSubscription> listByArea(ForumArea forumArea){
    return forumAreaSubscriptionDAO.listByArea(forumArea);
  }
  
  public List<ForumAreaSubscription> listByUser(UserEntity userEntity){
    return forumAreaSubscriptionDAO.listByUser(userEntity);
  }
  
  /**
   * When a workspace user is removed, remove all of their workspace discussion area subscriptions
   * 
   * @param event Workspace user removed event
   */
  public void onSchoolDataWorkspaceUserRemovedEvent(@Observes SchoolDataWorkspaceUserRemovedEvent event) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(event.getWorkspaceDataSource(), event.getWorkspaceIdentifier());
    UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(event.getUserDataSource(), event.getUserIdentifier());
    if (workspaceEntity != null && userEntity != null) {
      removeAreaSubscriptions(userEntity, workspaceEntity);
    }
  }

}
