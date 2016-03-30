package fi.otavanopisto.muikku.plugins.transcriptofrecords;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.entity.GradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScaleItem;
import fi.otavanopisto.security.LoggedIn;

@Named
@RequestScoped
@Join(path = "/records/", to = "/jsf/records/index.jsf")
@LoggedIn
public class TranscriptofRecordsBackingBean {
  
  @Inject
  private Logger logger;
  
  @Inject
  private GradingController gradingController;

  @RequestAction
	public String init() {
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
    
	  return null;
	}
  
  public String getGrades() {
    return grades;
  }
  
  private String grades;
	
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
