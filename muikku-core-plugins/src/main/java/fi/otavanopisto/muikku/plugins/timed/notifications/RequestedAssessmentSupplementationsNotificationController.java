package fi.otavanopisto.muikku.plugins.timed.notifications;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.plugins.timed.notifications.dao.RequestedAssessmentSupplementationNotificationDAO;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.RequestedAssessmentSupplementationNotification;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;

@Dependent
public class RequestedAssessmentSupplementationsNotificationController {
  
  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  @Inject
  private RequestedAssessmentSupplementationNotificationDAO requestedAssessmentSupplementationNotificationDAO;
  
  public SearchResult searchActiveStudents(List<OrganizationEntity> activeOrganizations, Collection<Long> groups, int firstResult, int maxResults){
    SearchProvider searchProvider = getProvider("elastic-search");
    return searchProvider.searchUsers(activeOrganizations, null, null, Collections.singleton(EnvironmentRoleArchetype.STUDENT), groups, null, null, false, true, false, 
        firstResult, maxResults, null, false);
  }
  
  public RequestedAssessmentSupplementationNotification createRequestedAssessmentSupplementationNotification(SchoolDataIdentifier studentIdentifier, SchoolDataIdentifier workspaceIdentifier){
    return requestedAssessmentSupplementationNotificationDAO.create(studentIdentifier.toId(), workspaceIdentifier.toId());
  }
  
  public long countByStudentIdentifierAndWorkspaceIdentifier(SchoolDataIdentifier studentIdentifier, SchoolDataIdentifier workspaceIdentifier){
    return requestedAssessmentSupplementationNotificationDAO.countByStudentIdentifierAndWorkspaceIdentifier(studentIdentifier.toId(), workspaceIdentifier.toId());
  }
  
  private SearchProvider getProvider(String name) {
    for (SearchProvider searchProvider : searchProviders) {
      if (name.equals(searchProvider.getName())) {
        return searchProvider;
      }
    }
    return null;
  }
  
}