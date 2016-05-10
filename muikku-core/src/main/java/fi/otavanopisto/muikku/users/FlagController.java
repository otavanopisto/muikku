package fi.otavanopisto.muikku.users;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.users.FlagDAO;
import fi.otavanopisto.muikku.dao.users.FlagShareDAO;
import fi.otavanopisto.muikku.dao.users.FlagStudentDAO;
import fi.otavanopisto.muikku.model.users.Flag;
import fi.otavanopisto.muikku.model.users.FlagShare;
import fi.otavanopisto.muikku.model.users.FlagStudent;
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

  public Flag findFlagById(Long flagId) {
    return flagDAO.findById(flagId);
  }
  
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

  public boolean hasFlagPermission(Flag flag, SchoolDataIdentifier userIdentifier) {
    UserSchoolDataIdentifier owner = flag.getOwnerIdentifier();
    SchoolDataIdentifier ownerIdentfier = toIdentifier(owner);
    if (ownerIdentfier.equals(userIdentifier)) {
      return true;
    }
    
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(userIdentifier);
    if (userSchoolDataIdentifier == null) {
      logger.severe(String.format("Could not find school data user by identifier %s", userIdentifier));
      return false;
    }
    
    FlagShare flagShare = flagShareDAO.findByFlagAndUserIdentifier(flag, userSchoolDataIdentifier);
    if (flagShare != null) {
      return true;
    }
    
    return false;
  }
  
  public List<SchoolDataIdentifier> getFlaggedStudents(List<Flag> flags) {
    List<UserSchoolDataIdentifier> students = flagStudentDAO.listStudentIdentifiersByFlags(flags);
    return toIdentifiers(students);
  }

  public FlagStudent findFlagStudentById(Long id) {
    return flagStudentDAO.findById(id);
  }

  public List<FlagStudent> listByOwnedAndSharedStudentFlags(SchoolDataIdentifier studentIdentifier,
      SchoolDataIdentifier userIdentifier) {
    
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(userIdentifier);
    if (userSchoolDataIdentifier == null) {
      logger.severe(String.format("Could not find school data user by identifier %s", userIdentifier));
      return Collections.emptyList();
    }
    
    UserSchoolDataIdentifier studentSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(studentIdentifier);
    if (studentSchoolDataIdentifier == null) {
      logger.severe(String.format("Could not find school data user by identifier %s", studentIdentifier));
      return Collections.emptyList();
    }

    List<FlagStudent> flagStudents = flagStudentDAO.listByStudentIdentifier(studentSchoolDataIdentifier);

    List<FlagStudent> result = new ArrayList<>(flagStudents.size());
    for (FlagStudent flagStudent : flagStudents) {
      if (hasFlagPermission(flagStudent.getFlag(), userIdentifier)) {
        result.add(flagStudent);
      }
    }
    
    return result;
  }

  public FlagStudent flagStudent(Flag flag, SchoolDataIdentifier studentIdentifier) {
    UserSchoolDataIdentifier studentSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(studentIdentifier);
    if (studentSchoolDataIdentifier == null) {
      logger.severe(String.format("Could not find school data user by identifier %s", studentIdentifier));
      return null;
    }
    
    FlagStudent flagStudent = flagStudentDAO.findByFlagAndStudentIdentifier(flag, studentSchoolDataIdentifier);
    if (flagStudent != null) {  
      return flagStudent;
    } 

    return flagStudentDAO.create(flag, studentSchoolDataIdentifier, new Date());
  }
  
  public void unflagStudent(Flag flag, SchoolDataIdentifier studentIdentifier) {
    UserSchoolDataIdentifier studentSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(studentIdentifier);
    if (studentSchoolDataIdentifier == null) {
      logger.severe(String.format("Could not find school data user by identifier %s", studentIdentifier));
      return;
    }
    
    FlagStudent flagStudent = flagStudentDAO.findByFlagAndStudentIdentifier(flag, studentSchoolDataIdentifier);
    if (flagStudent != null) {
      unflagStudent(flagStudent);
    }
  }
  
  public void unflagStudent(FlagStudent flagStudent) {
    flagStudentDAO.delete(flagStudent);
  }

  private List<SchoolDataIdentifier> toIdentifiers(List<UserSchoolDataIdentifier> userSchoolDataIdentifiers) {
    List<SchoolDataIdentifier> result = new ArrayList<>(userSchoolDataIdentifiers.size());
    
    for (UserSchoolDataIdentifier userSchoolDataIdentifier : userSchoolDataIdentifiers) {
      result.add(toIdentifier(userSchoolDataIdentifier));
    }
    
    return result;
  }

  private SchoolDataIdentifier toIdentifier(UserSchoolDataIdentifier userSchoolDataIdentifier) {
    SchoolDataIdentifier ownerIdentfier = new SchoolDataIdentifier(userSchoolDataIdentifier.getIdentifier(), userSchoolDataIdentifier.getDataSource().getIdentifier());
    return ownerIdentfier;
  }

}
