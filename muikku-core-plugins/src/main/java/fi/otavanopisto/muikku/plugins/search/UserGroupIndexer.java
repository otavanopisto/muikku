package fi.otavanopisto.muikku.plugins.search;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.search.SearchIndexer;
import fi.otavanopisto.muikku.users.UserGroupController;

public class UserGroupIndexer {
  
  @Inject
  private Logger logger;
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  private UserGroupController userGroupController;
  
  @Inject
  private SearchIndexer indexer;
  
  public void indexUserGroup(UserGroupEntity userGroupEntity) {
    if (!userGroupEntity.getArchived()) {
      indexUserGroup(userGroupEntity.schoolDataIdentifier());
    } else {
      removeUserGroup(userGroupEntity.schoolDataIdentifier());
    }
  }
  
  public void indexUserGroup(SchoolDataIdentifier userGroupIdentifier) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      UserGroup userGroup = userGroupController.findUserGroup(userGroupIdentifier);
      if (userGroup != null) {
        indexer.index(UserGroup.class.getSimpleName(), userGroup);
      } else {
        logger.info(String.format("Removing user group %s from index (not found from school data source)", userGroupIdentifier));
        removeUserGroup(userGroupIdentifier);
      }
    } catch (Exception ex) {
      logger.log(Level.SEVERE, "Indexing of user group identifier " + userGroupIdentifier.getIdentifier() + " failed.", ex);
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    } 
  }

  public void removeUserGroup(SchoolDataIdentifier userGroupIdentifier) {
    try {
      indexer.remove(UserGroup.class.getSimpleName(), String.format("%s/%s", userGroupIdentifier.getIdentifier(), userGroupIdentifier.getDataSource()));
    } catch (Exception ex) {
      logger.log(Level.SEVERE, String.format("Removal of user %s/%s from index failed", userGroupIdentifier.getDataSource(), userGroupIdentifier.getIdentifier()), ex);
    } 
  }

}
