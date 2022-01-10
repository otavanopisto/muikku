package fi.otavanopisto.muikku.plugins.timed.notifications;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.plugins.timed.notifications.dao.AssessmentRequestNotificationDAO;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.AssesmentRequestNotification;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;

@Dependent
public class AssesmentRequestNotificationController {

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  @Inject
  private AssessmentRequestNotificationDAO assessmentRequestNotificationDAO;
  
  public SearchResult searchActiveStudents(List<OrganizationEntity> activeOrganizations, Collection<Long> groups, int firstResult, int maxResults, List<SchoolDataIdentifier> excludeSchoolDataIdentifiers, Date startedStudiesBefore){
    SearchProvider searchProvider = getProvider("elastic-search");
    return searchProvider.searchUsers(activeOrganizations, null, null, Collections.singleton(EnvironmentRoleArchetype.STUDENT), groups, null, null, false, true, true, 
        firstResult, maxResults, null, excludeSchoolDataIdentifiers, startedStudiesBefore);
  }
  
  public AssesmentRequestNotification createAssesmentRequestNotification(SchoolDataIdentifier studentIdentifier){
    return assessmentRequestNotificationDAO.create(studentIdentifier.toId(), new Date());
  }
  
  public AssesmentRequestNotification findLatestByUserIdentifier(SchoolDataIdentifier identifier) {
    return assessmentRequestNotificationDAO.findLatestByUserIdentifier(identifier);
  }
  
  public List<SchoolDataIdentifier> listNotifiedSchoolDataIdentifiers(){
    List<SchoolDataIdentifier> results = new ArrayList<>();
    List<AssesmentRequestNotification> assessmentRequestNotifications = assessmentRequestNotificationDAO.listAll();
    for(AssesmentRequestNotification assessmentRequestNotification : assessmentRequestNotifications){
      results.add(SchoolDataIdentifier.fromId(assessmentRequestNotification.getStudentIdentifier()));
    }
    return results;
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
