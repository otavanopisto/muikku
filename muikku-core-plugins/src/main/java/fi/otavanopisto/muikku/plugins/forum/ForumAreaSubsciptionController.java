package fi.otavanopisto.muikku.plugins.forum;

import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.forum.dao.WorkspaceForumAreaDAO;
import fi.otavanopisto.muikku.plugins.forum.model.ForumArea;
import fi.otavanopisto.muikku.plugins.forum.model.WorkspaceForumArea;
import fi.otavanopisto.muikku.plugins.forum.wall.ForumAreaSubscription;
import fi.otavanopisto.muikku.plugins.forum.wall.ForumAreaSubscriptionDAO;

public class ForumAreaSubsciptionController {

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
  
}
