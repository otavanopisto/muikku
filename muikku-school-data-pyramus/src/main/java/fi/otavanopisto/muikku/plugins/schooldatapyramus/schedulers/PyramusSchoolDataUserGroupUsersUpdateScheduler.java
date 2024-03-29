package fi.otavanopisto.muikku.plugins.schooldatapyramus.schedulers;

import java.util.List;
import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.PyramusIdentifierMapper;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.PyramusUpdater;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.users.UserGroupEntityController;

@ApplicationScoped
public class PyramusSchoolDataUserGroupUsersUpdateScheduler extends PyramusDataScheduler implements PyramusUpdateScheduler {

  private static final int BATCH_SIZE = NumberUtils.createInteger(System.getProperty("muikku.pyramus-updater.usergroup-users.batchsize", "20"));

  @Inject
  private Logger logger;

  @Inject
  private UserGroupEntityController userGroupEntityController;

  @Inject
  private PyramusIdentifierMapper identityMapper;

  @Inject
  private PyramusUpdater pyramusUpdater;

  @Override
  public String getSchedulerName() {
    return "usergroup-users";
  }
  
  public void synchronize() {
    int currentOffset = getAndUpdateCurrentOffset(BATCH_SIZE);
    int count = 0;
    try {
      logger.fine("Synchronizing Pyramus user group users");

      List<UserGroupEntity> userGroupEntities = userGroupEntityController.listUserGroupEntitiesByDataSource(
          SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, currentOffset, BATCH_SIZE);
      if (userGroupEntities.size() == 0) {
        resetCurrentOffset();
      }
      else {
        for (UserGroupEntity userGroupEntity : userGroupEntities) {
          switch (identityMapper.getStudentGroupType(userGroupEntity.getIdentifier())) {
            case STUDENTGROUP:
              Long userGroupId = identityMapper.getPyramusStudentGroupId(userGroupEntity.getIdentifier());
              count += pyramusUpdater.updateStudentGroupUsers(userGroupId);
            break;
            case STUDYPROGRAMME:
              // No efficient way to update all study programme members
            break;
          }
        }
      }
    } finally {
      logger.fine(String.format("Synchronized %d Pyramus user group users", count));
    }
  }
  
  @Override
  public int getPriority() {
    return 4;
  }

}