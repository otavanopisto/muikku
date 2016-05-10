package fi.otavanopisto.muikku.users;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.users.FlagDAO;
import fi.otavanopisto.muikku.dao.users.FlagShareDAO;
import fi.otavanopisto.muikku.dao.users.FlagStudentDAO;
import fi.otavanopisto.muikku.dao.users.StudentFlagDAO;
import fi.otavanopisto.muikku.model.users.Flag;
import fi.otavanopisto.muikku.model.users.FlagShare;
import fi.otavanopisto.muikku.model.users.StudentFlag;
import fi.otavanopisto.muikku.model.users.StudentFlagType;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class FlagController {

  @Inject
  private Logger logger;
  
  @Inject
  private FlagDAO flagDAO;
  
  @Inject
  private FlagStudentDAO flagStudentDAO;
  
  @Inject
  private FlagShareDAO flagShareDAO;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  public List<Flag> listByOwnedAndSharedFlags(SchoolDataIdentifier ownerIdentifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(ownerIdentifier);
    if (userSchoolDataIdentifier == null) {
      logger.severe(String.format("Could not find school data user by identifier %s", ownerIdentifier));
      return Collections.emptyList();
    }
    
    return listByOwnedAndSharedFlags(userSchoolDataIdentifier);
  }
  
  public List<Flag> listByOwnedAndSharedFlags(UserSchoolDataIdentifier userSchoolDataIdentifier) {
    List<Flag> flags = flagShareDAO.listFlagsByUserIdentifier(userSchoolDataIdentifier);
    flags.addAll(flagDAO.listByOwnerIdentifier(userSchoolDataIdentifier));
    return flags;
  }
  
  
  

}
