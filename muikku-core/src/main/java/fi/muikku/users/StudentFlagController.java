package fi.muikku.users;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.muikku.dao.users.StudentFlagDAO;
import fi.muikku.model.users.StudentFlag;
import fi.muikku.model.users.StudentFlagType;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.schooldata.SchoolDataIdentifier;

public class StudentFlagController {

  @Inject
  private Logger logger;
  
  @Inject
  private StudentFlagDAO studentFlagDAO;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
   
  public List<StudentFlag> listOwnerFlagsByTypes(UserSchoolDataIdentifier ownerIdentifier, List<StudentFlagType> types) {
    return studentFlagDAO.listByOwnerAndTypes(ownerIdentifier, types);
  }
  
  public List<StudentFlag> listOwnerFlagsByTypes(SchoolDataIdentifier ownerIdentifier, List<StudentFlagType> types) {
    UserSchoolDataIdentifier ownerSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(ownerIdentifier.getDataSource(), ownerIdentifier.getIdentifier());
    if (ownerSchoolDataIdentifier != null) {
      return listOwnerFlagsByTypes(ownerSchoolDataIdentifier, types);
    } else {
      logger.severe(String.format("Could not find UserSchoolDataIdentifier by %s", ownerIdentifier));
      return Collections.emptyList();
    }
  }
  
  public List<SchoolDataIdentifier> listOwnerFlaggedUserIdentifiersByTypes(SchoolDataIdentifier ownerIdentifier, List<StudentFlagType> studentFlagTypes) {
    List<SchoolDataIdentifier> result = new ArrayList<>();
    
    List<StudentFlag> studentFlags = listOwnerFlagsByTypes(ownerIdentifier, studentFlagTypes);
    for (StudentFlag studentFlag : studentFlags) {
      result.add(new SchoolDataIdentifier(studentFlag.getStudentIdentifier().getIdentifier(), studentFlag.getStudentIdentifier().getDataSource().getIdentifier()));
    }
    
    return result;
  }

  public List<StudentFlagType> listOwnerFlagTypes(SchoolDataIdentifier ownerIdentifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(ownerIdentifier.getDataSource(), ownerIdentifier.getIdentifier());
    if (userSchoolDataIdentifier != null) {
      return listOwnerFlagTypes(userSchoolDataIdentifier);
    } else {
      logger.severe(String.format("Could not find UserSchoolDataIdentifier by %s", ownerIdentifier));
      return Collections.emptyList();
    }
    
  }

  public List<StudentFlagType> listOwnerFlagTypes(UserSchoolDataIdentifier ownerSchoolDataIdentifier) {
    return studentFlagDAO.listTypesByOwner(ownerSchoolDataIdentifier);
  }

}
