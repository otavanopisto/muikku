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
import fi.otavanopisto.muikku.plugins.timed.notifications.dao.StudyTimeNotificationDAO;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.StudyTimeNotification;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;

@Dependent
public class StudyTimeLeftNotificationController {

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  @Inject
  private StudyTimeNotificationDAO studyTimeNotificationDAO;
  
  public SearchResult searchActiveStudents(List<OrganizationEntity> activeOrganizations, Collection<Long> groups, int firstResult, int maxResults, List<SchoolDataIdentifier> excludeSchoolDataIdentifiers, Date studyTimeEndsBefore){
    SearchProvider searchProvider = getProvider("elastic-search");
    return searchProvider.searchUsers(activeOrganizations, null, null, Collections.singleton(EnvironmentRoleArchetype.STUDENT), groups, 
        null, null, false, true, true, firstResult, maxResults, null, excludeSchoolDataIdentifiers, null, studyTimeEndsBefore, false);
  }

  public List<SchoolDataIdentifier> listNotifiedSchoolDataIdentifiersAfter(Date date){
    List<SchoolDataIdentifier> results = new ArrayList<>();
    List<StudyTimeNotification> studyTimeNotifications = studyTimeNotificationDAO.listByDateAfter(date);
    for (StudyTimeNotification studyTimeNotification : studyTimeNotifications) {
      results.add(SchoolDataIdentifier.fromId(studyTimeNotification.getStudentIdentifier()));
    }
    return results;
  }
  
  public StudyTimeNotification createStudyTimeNotification(SchoolDataIdentifier studentIdentifier){
    return studyTimeNotificationDAO.create(studentIdentifier.toId(), new Date());
  }

  public StudyTimeNotification findLatestByUserIdentifier(SchoolDataIdentifier identifier) {
    return studyTimeNotificationDAO.findLatestByUserIdentifier(identifier);
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
