package fi.otavanopisto.muikku.plugins.hops;

import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.hops.dao.HopsSuggestionDAO;
import fi.otavanopisto.muikku.plugins.hops.model.HopsSuggestion;

public class HopsController {

  @Inject
  private HopsSuggestionDAO hopsSuggestionDAO;
  
  public List<HopsSuggestion> listSuggestionsByStudentIdentifier(String studentIdentifeir) {
    return hopsSuggestionDAO.listByStudentIdentifier(studentIdentifeir);
  }
  
  public void removeSuggestion(HopsSuggestion hopsSuggestion) {
    hopsSuggestionDAO.delete(hopsSuggestion);
  }
  
  public HopsSuggestion findByStudentIdentifierAndSubjectAndCourseNumber(String studentIdentifier, String subject, Integer courseNumber) {
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
