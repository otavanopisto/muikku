package fi.otavanopisto.muikku.plugins.hops;

import java.util.Comparator;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.hops.dao.HopsDAO;
import fi.otavanopisto.muikku.plugins.hops.dao.HopsHistoryDAO;
import fi.otavanopisto.muikku.plugins.hops.dao.HopsSuggestionDAO;
import fi.otavanopisto.muikku.plugins.hops.model.Hops;
import fi.otavanopisto.muikku.plugins.hops.model.HopsHistory;
import fi.otavanopisto.muikku.plugins.hops.model.HopsSuggestion;
import fi.otavanopisto.muikku.session.SessionController;

public class HopsController {

  @Inject
  private SessionController sessionController;

  @Inject
  private HopsDAO hopsDAO;

  @Inject
  private HopsHistoryDAO hopsHistoryDAO;
  
  @Inject
  private HopsSuggestionDAO hopsSuggestionDAO;
  
  public Hops createHops(String studentIdentifier, String formData) {
    Hops hops = hopsDAO.create(studentIdentifier, formData);
    hopsHistoryDAO.create(studentIdentifier, new Date(), sessionController.getLoggedUser().toId());
    return hops;
  }

  public Hops updateHops(Hops hops, String studentIdentifier, String formData) {
    hopsDAO.updateFormData(hops, formData);
    hopsHistoryDAO.create(studentIdentifier, new Date(), sessionController.getLoggedUser().toId());
    return hops;
  }
  
  public Hops findHopsByStudentIdentifier(String studentIdentifier) {
    return hopsDAO.findByStudentIdentifier(studentIdentifier);
  }
  
  public List<HopsHistory> listHistoryByStudentIdentifier(String studentIdentifier) {
    List<HopsHistory> history = hopsHistoryDAO.listByStudentIdentifier(studentIdentifier);
    history.sort(Comparator.comparing(HopsHistory::getDate));
    return history;
  }
  
  public List<HopsSuggestion> listSuggestionsByStudentIdentifier(String studentIdentifeir) {
    return hopsSuggestionDAO.listByStudentIdentifier(studentIdentifeir);
  }
  
  public void removeSuggestion(HopsSuggestion hopsSuggestion) {
    hopsSuggestionDAO.delete(hopsSuggestion);
  }
  
  public HopsSuggestion findSuggestionByStudentIdentifierAndSubjectAndCourseNumber(String studentIdentifier, String subject, Integer courseNumber) {
    return hopsSuggestionDAO.findByStudentIdentifierAndSubjectAndCourseNumber(studentIdentifier, subject, courseNumber);
  }
  
  public HopsSuggestion suggestWorkspace(String studentIdentifier, String subject, Integer courseNumber, Long workspaceEntityId) {
    HopsSuggestion hopsSuggestion = hopsSuggestionDAO.findByStudentIdentifierAndSubjectAndCourseNumber(studentIdentifier, subject, courseNumber);
    if (hopsSuggestion != null) {
      hopsSuggestion = hopsSuggestionDAO.update(hopsSuggestion, studentIdentifier, subject, courseNumber, workspaceEntityId);
    }
    else {
      hopsSuggestion = hopsSuggestionDAO.create(studentIdentifier, subject, courseNumber, workspaceEntityId);
    }
    return hopsSuggestion;
  }

  public void unsuggestWorkspace(String studentIdentifier, String subject, Integer courseNumber) {
    HopsSuggestion hopsSuggestion = hopsSuggestionDAO.findByStudentIdentifierAndSubjectAndCourseNumber(studentIdentifier, subject, courseNumber);
    if (hopsSuggestion != null) {
      hopsSuggestionDAO.delete(hopsSuggestion);
    }
  }

}
