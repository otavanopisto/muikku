package fi.otavanopisto.muikku.plugins.profile;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ConversationScoped;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserAddress;
import fi.otavanopisto.muikku.schooldata.entity.UserPhoneNumber;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join (path = "/profile/hops", to = "/jsf/profile/hops.jsf")
public class HopsBackingBean {
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private UserController userController;
  
  @Inject
  private UserEmailEntityController userEmailEntityController;
  
  @RequestAction
  @LoggedIn
  public String init() {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    User user = userController.findUserByDataSourceAndIdentifier(sessionController.getLoggedUserSchoolDataSource(), sessionController.getLoggedUserIdentifier());
    List<UserAddress> userAddresses = userController.listUserAddresses(user);
    List<UserPhoneNumber> userPhoneNumbers = userController.listUserPhoneNumbers(user);
    
    displayName = user.getDisplayName();
    return null;
  }
  
  public String save() {
    return null;
  }
  
  public String getDisplayName() {
    return displayName;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDate() {
    return date;
  }

  public void setDate(String date) {
    this.date = date;
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

  public boolean isEnglish() {
    return english;
  }

  public void setEnglish(boolean english) {
    this.english = english;
  }

  public boolean isSwedish() {
    return swedish;
  }

  public void setSwedish(boolean swedish) {
    this.swedish = swedish;
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

  private String displayName;
  private String name;
  private String date;
  private String goalSecondarySchoolDegree;
  private String goalMatriculationExam;
  private String vocationalYears;
  private String goalJustMatriculationExam;
  private String justTransferCredits;
  private String completionYears;
  private String mathSyllabus;
  private boolean english;
  private boolean swedish;
  private boolean german;
  private boolean french;
  private boolean italian;
  private boolean spanish;
}
