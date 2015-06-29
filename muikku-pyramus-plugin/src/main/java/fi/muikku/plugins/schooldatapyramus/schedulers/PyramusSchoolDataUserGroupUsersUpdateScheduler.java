package fi.muikku.plugins.schooldatapyramus.schedulers;

import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;

import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.plugins.schooldatapyramus.PyramusIdentifierMapper;
import fi.muikku.plugins.schooldatapyramus.PyramusUpdater;
import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.users.UserGroupEntityController;

@Dependent
@Stateful
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
  
  public void synchronize() throws UnexpectedSchoolDataBridgeException {
    int offset = getOffset();
    int count = 0;
    try {
      logger.fine("Synchronizing Pyramus user group users");

      List<UserGroupEntity> userGroupEntities = userGroupEntityController.listUserGroupEntitiesByDataSource(
          SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, offset, BATCH_SIZE);
      if (userGroupEntities.size() == 0) {
        updateOffset(0);
      } else {
        for (UserGroupEntity userGroupEntity : userGroupEntities) {
          switch (identityMapper.getStudentGroupType(userGroupEntity.getIdentifier())) {
            case STUDENTGROUP:
              Long userGroupId = identityMapper.getPyramusStudentGroupId(userGroupEntity.getIdentifier());
              count += pyramusUpdater.updateStudentGroupUsers(userGroupId);
            break;
            case STUDYPROGRAMME:
              Long studyProgrammeId = identityMapper.getPyramusStudyProgrammeId(userGroupEntity.getIdentifier());
              count += pyramusUpdater.updateStudyProgrammeGroupUsers(studyProgrammeId);
            break;
          }
        }

        updateOffset(offset + userGroupEntities.size());
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
