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
import fi.otavanopisto.muikku.plugins.timed.notifications.dao.NoLoggedInForTwoMonthsNotificationDAO;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.NoLoggedInForTwoMonthsNotification;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;

@Dependent
public class NoLoggedInForTwoMonthsNotificationController {

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  @Inject
  private NoLoggedInForTwoMonthsNotificationDAO noLoggedInForTwoMonthsNotificationDAO;
  
  public SearchResult searchActiveStudents(List<OrganizationEntity> activeOrganizations, Collection<Long> groups, int firstResult, int maxResults, List<SchoolDataIdentifier> excludeSchoolDataIdentifiers, Date studiesStartedBefore){
    SearchProvider searchProvider = getProvider("elastic-search");
    return searchProvider.searchUsers(activeOrganizations, null, null, Collections.singleton(EnvironmentRoleArchetype.STUDENT), groups, 
        null, null, false, true, true, firstResult, maxResults, null, excludeSchoolDataIdentifiers, 
        studiesStartedBefore, null, false);
  }

  public List<SchoolDataIdentifier> listNotifiedSchoolDataIdentifiersAfter(Date date){
    List<SchoolDataIdentifier> results = new ArrayList<>();
    List<NoLoggedInForTwoMonthsNotification> noLoggedInForTwoMonthsNotifications = noLoggedInForTwoMonthsNotificationDAO.listByDateAfter(date);
    for (NoLoggedInForTwoMonthsNotification noLoggedInForTwoMonthsNotification : noLoggedInForTwoMonthsNotifications) {
      results.add(SchoolDataIdentifier.fromId(noLoggedInForTwoMonthsNotification.getStudentIdentifier()));
    }
    return results;
  }
  
  public NoLoggedInForTwoMonthsNotification createNoLoggedInForTwoMonthsNotification(SchoolDataIdentifier studentIdentifier){
    return noLoggedInForTwoMonthsNotificationDAO.create(studentIdentifier.toId(), new Date());
  }

  public NoLoggedInForTwoMonthsNotification findLatestByUserIdentifier(SchoolDataIdentifier identifier) {
    return noLoggedInForTwoMonthsNotificationDAO.findLatestByUserIdentifier(identifier);
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
