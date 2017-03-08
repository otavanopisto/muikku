package fi.otavanopisto.muikku.plugins.profile;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.EnvironmentUser;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserProperty;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.EnvironmentUserController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join (path = "/profile/hops", to = "/jsf/profile/hops.jsf")
public class HopsBackingBean {
  
  @Inject
  private UserSchoolDataController userSchoolDataController;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private UserController userController;
  
  @Inject
  private EnvironmentUserController environmentUserController;
  
  @RequestAction
  @LoggedIn
  public String init() {
    SchoolDataIdentifier userIdentifier = sessionController.getLoggedUser();
    User user = userController.findUserByIdentifier(userIdentifier);
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    EnvironmentUser environmentUser = environmentUserController.findEnvironmentUserByUserEntity(userEntity);
    EnvironmentRoleEntity roleEntity = environmentUser.getRole();

    if (EnvironmentRoleArchetype.STUDENT.equals(roleEntity.getArchetype())) {
      student = true;
      goalSecondarySchoolDegree = loadStringProperty(user, "goalSecondarySchoolDegree");
      goalMatriculationExam = loadStringProperty(user, "goalMatriculationExam");
      vocationalYears = loadStringProperty(user, "vocationalYears");
      goalJustMatriculationExam = loadStringProperty(user, "goalJustMatriculationExam");
      justTransferCredits = loadStringProperty(user, "justTransferCredits");
      transferCreditYears = loadStringProperty(user, "transferCreditYears");
      completionYears = loadStringProperty(user, "completionYears");
      mathSyllabus = loadStringProperty(user, "mathSyllabus");
      finnish = loadBoolProperty(user, "finnish");
      swedish = loadBoolProperty(user, "swedish");
      english = loadBoolProperty(user, "english");
      german = loadBoolProperty(user, "german");
      french = loadBoolProperty(user, "french");
      italian = loadBoolProperty(user, "italian");
      spanish = loadBoolProperty(user, "spanish");
      religion = loadStringProperty(user, "religion");
    } else {
      student = false;
    }

    return null;
  }
  
  public String save() {
    SchoolDataIdentifier userIdentifier = sessionController.getLoggedUser();
    User user = userController.findUserByIdentifier(userIdentifier);
    
    saveStringProperty(user, "goalSecondarySchoolDegree", goalSecondarySchoolDegree);
    saveStringProperty(user, "goalMatriculationExam", goalMatriculationExam);
    saveStringProperty(user, "vocationalYears", vocationalYears);
    saveStringProperty(user, "goalJustMatriculationExam", goalJustMatriculationExam);
    saveStringProperty(user, "justTransferCredits", justTransferCredits);
    saveStringProperty(user, "transferCreditYears", transferCreditYears);
    saveStringProperty(user, "completionYears", completionYears);
    saveStringProperty(user, "mathSyllabus", mathSyllabus);
    saveBoolProperty(user, "finnish", finnish);
    saveBoolProperty(user, "swedish", swedish);
    saveBoolProperty(user, "english", english);
    saveBoolProperty(user, "german", german);
    saveBoolProperty(user, "french", french);
    saveBoolProperty(user, "italian", italian);
    saveBoolProperty(user, "spanish", spanish);
    saveStringProperty(user, "religion", religion);

    return null;
  }
  
  private String loadStringProperty(User user, String propertyName) {
    UserProperty property = userSchoolDataController.getUserProperty(user, "hops." + propertyName);
    if (property != null) {
      return property.getValue();
    } else {
      return null;
    }
  }

  private boolean loadBoolProperty(User user, String propertyName) {
    UserProperty property = userSchoolDataController.getUserProperty(user, "hops." + propertyName);
    if (property != null) {
      return "yes".equals(property.getValue());
    } else {
      return false;
    }
  }
  
  private void saveStringProperty(User user, String propertyName, String value) {
    if (value != null && !"".equals(value)) {
      userSchoolDataController.setUserProperty(user, "hops." + propertyName, value);
    }
  }
  
  private void saveBoolProperty(User user, String propertyName, boolean value) {
    userSchoolDataController.setUserProperty(user, "hops." + propertyName, value ? "yes" : "no");
  }
  
  public String getGoalSecondarySchoolDegree() {
    return goalSecondarySchoolDegree;
  }

  public void setGoalSecondarySchoolDegree(String goalSecondarySchoolDegree) {
    this.goalSecondarySchoolDegree = goalSecondarySchoolDegree;
  }

  public String getGoalMatriculationExam() {
    return goalMatriculationExam;
  }

  public void setGoalMatriculationExam(String goalMatriculationExam) {
    this.goalMatriculationExam = goalMatriculationExam;
  }

  public String getVocationalYears() {
    return vocationalYears;
  }

  public void setVocationalYears(String vocationalYears) {
    this.vocationalYears = vocationalYears;
  }

  public String getGoalJustMatriculationExam() {
    return goalJustMatriculationExam;
  }

  public void setGoalJustMatriculationExam(String goalJustMatriculationExam) {
    this.goalJustMatriculationExam = goalJustMatriculationExam;
  }

  public String getJustTransferCredits() {
    return justTransferCredits;
  }

  public void setJustTransferCredits(String justTransferCredits) {
    this.justTransferCredits = justTransferCredits;
  }
  
  public String getTransferCreditYears() {
    return transferCreditYears;
  }
  
  public void setTransferCreditYears(String transferCreditYears) {
    this.transferCreditYears = transferCreditYears;
  }

  public String getCompletionYears() {
    return completionYears;
  }

  public void setCompletionYears(String completionYears) {
    this.completionYears = completionYears;
  }

  public String getMathSyllabus() {
    return mathSyllabus;
  }

  public void setMathSyllabus(String mathSyllabus) {
    this.mathSyllabus = mathSyllabus;
  }
  
  public boolean isFinnish() {
    return finnish;
  }
  
  public void setFinnish(boolean finnish) {
    this.finnish = finnish;
  }

  public boolean isSwedish() {
    return swedish;
  }

  public void setSwedish(boolean swedish) {
    this.swedish = swedish;
  }

  public boolean isEnglish() {
    return english;
  }

  public void setEnglish(boolean english) {
    this.english = english;
  }

  public boolean isGerman() {
    return german;
  }

  public void setGerman(boolean german) {
    this.german = german;
  }

  public boolean isFrench() {
    return french;
  }

  public void setFrench(boolean french) {
    this.french = french;
  }

  public boolean isItalian() {
    return italian;
  }

  public void setItalian(boolean italian) {
    this.italian = italian;
  }

  public boolean isSpanish() {
    return spanish;
  }

  public void setSpanish(boolean spanish) {
    this.spanish = spanish;
  }
  
  public boolean isStudent() {
    return student;
  }
  
  public void setStudent(boolean student) {
    this.student = student;
  }
  
  public String getReligion() {
    return religion;
  }
  
  public void setReligion(String religion) {
    this.religion = religion;
  }

  private String goalSecondarySchoolDegree;
  private String goalMatriculationExam;
  private String vocationalYears;
  private String goalJustMatriculationExam;
  private String justTransferCredits;
  private String transferCreditYears;
  private String completionYears;
  private String mathSyllabus;
  private boolean finnish;
  private boolean swedish;
  private boolean english;
  private boolean german;
  private boolean french;
  private boolean italian;
  private boolean spanish;
  private boolean student;
  private String religion;
}
