package fi.otavanopisto.muikku.users;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.users.StudentFlagDAO;
import fi.otavanopisto.muikku.model.users.StudentFlag;
import fi.otavanopisto.muikku.model.users.StudentFlagType;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

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

  public List<StudentFlag> listStudentFlagsByOwner(SchoolDataIdentifier studentIdentifier,
      SchoolDataIdentifier ownerIdentifier) {
    UserSchoolDataIdentifier ownerSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(ownerIdentifier);
    if (ownerSchoolDataIdentifier == null) {
      logger.severe(String.format("Could not find UserSchoolDataIdentifier for %s", ownerIdentifier));
      return Collections.emptyList();
    }
    
    UserSchoolDataIdentifier studentSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(studentIdentifier);
    if (studentSchoolDataIdentifier == null) {
      logger.severe(String.format("Could not find UserSchoolDataIdentifier for %s", studentIdentifier));
      return Collections.emptyList();
    }
    
    return listStudentFlagsByOwner(studentSchoolDataIdentifier, ownerSchoolDataIdentifier);
  }

  public StudentFlag createStudentFlag(SchoolDataIdentifier ownerIdentifier, SchoolDataIdentifier studentIdentifier, StudentFlagType type) {
    UserSchoolDataIdentifier ownerSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(ownerIdentifier);
    if (ownerSchoolDataIdentifier == null) {
      logger.severe(String.format("Could not find UserSchoolDataIdentifier for %s", ownerIdentifier));
      return null;
    }
    
    UserSchoolDataIdentifier studentSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(studentIdentifier);
    if (studentSchoolDataIdentifier == null) {
      logger.severe(String.format("Could not find UserSchoolDataIdentifier for %s", studentIdentifier));
      return null;
    }
    
    return createStudentFlag(ownerSchoolDataIdentifier, studentSchoolDataIdentifier, type);
  }

  public StudentFlag createStudentFlag(UserSchoolDataIdentifier ownerSchoolDataIdentifier, UserSchoolDataIdentifier studentSchoolDataIdentifier, StudentFlagType type) {
    return studentFlagDAO.create(ownerSchoolDataIdentifier, studentSchoolDataIdentifier, type);
  }

  public StudentFlag findStudentFlagById(Long id) {
    return studentFlagDAO.findById(id);
  }

  public List<StudentFlag> listStudentFlagsByOwner(UserSchoolDataIdentifier studentSchoolDataIdentifier,
      UserSchoolDataIdentifier ownerSchoolDataIdentifier) {
    return studentFlagDAO.listByStudentIdentifierAndOwnerIdentifier(studentSchoolDataIdentifier, ownerSchoolDataIdentifier);
  }

  public StudentFlag updateStudentFlag(StudentFlag studentFlag, StudentFlagType type) {
    return studentFlagDAO.updateType(studentFlag, type);
  }

  public void deleteStudentFlag(StudentFlag studentFlag) {
    studentFlagDAO.delete(studentFlag);
  }

}
