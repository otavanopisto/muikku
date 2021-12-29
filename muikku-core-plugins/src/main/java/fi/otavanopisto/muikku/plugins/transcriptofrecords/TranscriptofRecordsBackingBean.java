package fi.otavanopisto.muikku.plugins.transcriptofrecords;

import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.TranscriptOfRecordsFile;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.GradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScaleItem;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join(path = "/records", to = "/jsf/records/index.jsf")
@LoggedIn
public class TranscriptofRecordsBackingBean {
  
  @Inject
  private Logger logger;

  @Inject
  private SessionController sessionController;

  @Inject
  private GradingController gradingController;
  
  @Inject
  private TranscriptOfRecordsFileController transcriptOfRecordsFileController;

  @Inject
  private TranscriptOfRecordsController transcriptOfRecordsController;

  @Inject
  private UserController userController;

  @Inject
  private UserEntityController userEntityController;
  
  @RequestAction
  public String init() {
    if (!sessionController.hasEnvironmentPermission(TranscriptofRecordsPermissions.TRANSCRIPT_OF_RECORDS_VIEW)) {
      return NavigationRules.ACCESS_DENIED;
    }
    
    Map<String, Grade> grades = new HashMap<>();
    
    List<GradingScale> gradingScales = gradingController.listGradingScales();
    for (GradingScale gradingScale : gradingScales) {
      List<GradingScaleItem> scaleItems = gradingController.listGradingScaleItems(gradingScale);
      for (GradingScaleItem scaleItem : scaleItems) {
        String id = StringUtils.join(new String[] { 
            gradingScale.getSchoolDataSource(), 
            gradingScale.getIdentifier(), 
            scaleItem.getSchoolDataSource(), 
            scaleItem.getIdentifier() }, '-');
        String grade = scaleItem.getName();
        String scale = gradingScale.getName();
        Boolean passing = scaleItem.isPassingGrade();
        
        grades.put(id, new Grade(grade, scale, passing));
      }
    }
    
    try {
      this.grades = new ObjectMapper().writeValueAsString(grades);
    } catch (JsonProcessingException e) {
      logger.log(Level.SEVERE, "Failed to serialize grades", e);
      return NavigationRules.INTERNAL_ERROR;
    }
    
    UserEntity loggedEntity = sessionController.getLoggedUserEntity();
    User user = userController.findUserByDataSourceAndIdentifier(sessionController.getLoggedUserSchoolDataSource(), sessionController.getLoggedUserIdentifier());
    
    studyStartDate = user.getStudyStartDate();
    studyEndDate = user.getStudyEndDate();
    studyTimeEnd = user.getStudyTimeEnd();
    studyTimeLeftStr = userEntityController.getStudyTimeEndAsString(studyTimeEnd);
    
    List<TranscriptOfRecordsFile> transcriptOfRecordsFiles;
    if (loggedEntity != null) {
      transcriptOfRecordsFiles = transcriptOfRecordsFileController.listFiles(loggedEntity);
    } else {
      transcriptOfRecordsFiles = Collections.emptyList();
    }

    try {
      files = new ObjectMapper().writeValueAsString(transcriptOfRecordsFiles);
    } catch (JsonProcessingException e) {
      logger.log(Level.SEVERE, "Failed to serialize files", e);
      return NavigationRules.INTERNAL_ERROR;
    }
    
    return null;
  }
  
  public String getGrades() {
    return grades;
  }
  
  public String getFiles() {
    return files;
  }
  
  public Boolean getShowStudies() {
    SchoolDataIdentifier userIdentifier = sessionController.getLoggedUser();
    User user = userController.findUserByIdentifier(userIdentifier);
    return transcriptOfRecordsController.shouldShowStudies(user);
  }
  
  public String getStudyStartDate() {
    return studyStartDate != null ? studyStartDate.toString() : null;
  }

  public String getStudyTimeEnd() {
    return studyTimeEnd != null ? studyTimeEnd.toString() : null;
  }

  public String getStudyTimeLeftStr() {
    return studyTimeLeftStr;
  }
  
  public String getStudyEndDate() {
    return studyEndDate != null ? studyEndDate.toString() : null;
  }

  private String grades;
  private String files;
  private OffsetDateTime studyStartDate;
  private OffsetDateTime studyEndDate;
  private OffsetDateTime studyTimeEnd;
  private String studyTimeLeftStr;
  
  public static class Grade {
    
    public Grade(String grade, String scale, Boolean passing) {
      this.scale = scale;
      this.grade = grade;
      this.passing = passing;
    }
    
    public String getScale() {
      return scale;
    }

    public String getGrade() {
      return grade;
    }
    
    public Boolean getPassing() {
      return passing;
    }
    
    private String scale;
    private String grade;
    private Boolean passing;
  }
}
