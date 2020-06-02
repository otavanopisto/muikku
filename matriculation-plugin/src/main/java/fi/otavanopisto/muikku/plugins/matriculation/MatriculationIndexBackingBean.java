package fi.otavanopisto.muikku.plugins.matriculation;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.schooldata.MatriculationSchoolDataController;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.LoggedIn;

@Named
@RequestScoped
@Join(path = "/matriculation-enrollment/{examId}", to = "/jsf/matriculation/index.jsf")
@LoggedIn
public class MatriculationIndexBackingBean {

  @Inject
  private SessionController sessionController;

  @Inject
  private MatriculationSchoolDataController matriculationController;

  @Parameter
  private Long examId;

  @RequestAction
  public String init() {
    if (!sessionController.isActiveUser()) {
      return NavigationRules.ACCESS_DENIED;
    }
    
    // Validate examId
    if (examId == null || !matriculationController.isEligible(examId)) {
      return NavigationRules.NOT_FOUND;
    }
    
    return null;
  }

  public void setExamId(Long examId) {
    this.examId = examId;
  }
  
  public Long getExamId() {
    return examId;
  }
}
