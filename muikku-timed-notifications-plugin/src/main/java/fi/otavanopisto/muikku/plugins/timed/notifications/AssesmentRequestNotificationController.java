package fi.otavanopisto.muikku.plugins.timed.notifications;

import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.logging.Logger;

import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
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
  
  @Inject
  private Logger logger;
  
  public SearchResult searchActiveStudentIds(Collection<Long> groups, int firstResult, int maxResults){
    SearchProvider searchProvider = getProvider("elastic-search");
    return searchProvider.searchUsers(null, null, Collections.singleton(EnvironmentRoleArchetype.STUDENT), groups, null, null, false, true, firstResult, maxResults, null); //TODO: search only ids
  }
  
  public AssesmentRequestNotification createAssesmentRequestNotification(SchoolDataIdentifier studentIdentifier){
    return assessmentRequestNotificationDAO.create(studentIdentifier.toId(), new Date());
  }
  
  public Long countAssessmentRequestNotificationsBySchoolDataIdentifierAfter(SchoolDataIdentifier studentIdentifier, Date date) {
    return assessmentRequestNotificationDAO.countByStudentIdentifierAndDateAfter(studentIdentifier.toId(), date);
  }
  
  private SearchProvider getProvider(String name) {
    Iterator<SearchProvider> i = searchProviders.iterator();
    while (i.hasNext()) {
      SearchProvider provider = i.next();
      if (name.equals(provider.getName())) {
        return provider;
      }
    }
    return null;
  }
  
}
