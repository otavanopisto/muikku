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
import fi.otavanopisto.muikku.plugins.timed.notifications.dao.NeverLoggedInNotificationDAO;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.NeverLoggedInNotification;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;

@Dependent
public class NeverLoggedInNotificationController {

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  @Inject
  private NeverLoggedInNotificationDAO neverLoggedInNotificationDAO;
  
  public SearchResult searchActiveStudentIds(List<OrganizationEntity> activeOrganizations, Collection<Long> groups, int firstResult, int maxResults, List<SchoolDataIdentifier> excludeSchoolDataIdentifiers, Date studiesStartedBefore){
    SearchProvider searchProvider = getProvider("elastic-search");
    return searchProvider.searchUsers(activeOrganizations, null, null, Collections.singleton(EnvironmentRoleArchetype.STUDENT), groups, 
        null, null, false, true, true, firstResult, maxResults, Collections.singleton("id"), excludeSchoolDataIdentifiers, 
        studiesStartedBefore, null);
  }

  public List<SchoolDataIdentifier> listNotifiedSchoolDataIdentifiersAfter(Date date){
    List<SchoolDataIdentifier> results = new ArrayList<>();
    List<NeverLoggedInNotification> neverLoggedInNotifications = neverLoggedInNotificationDAO.listByDateAfter(date);
    for (NeverLoggedInNotification neverLoggedInNotification : neverLoggedInNotifications) {
      results.add(SchoolDataIdentifier.fromId(neverLoggedInNotification.getStudentIdentifier()));
    }
    return results;
  }
  
  public NeverLoggedInNotification createNeverLoggedInNotification(SchoolDataIdentifier studentIdentifier){
    return neverLoggedInNotificationDAO.create(studentIdentifier.toId(), new Date());
  }

  public NeverLoggedInNotification findLatestByUserIdentifier(SchoolDataIdentifier identifier) {
    return neverLoggedInNotificationDAO.findLatestByUserIdentifier(identifier);
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
