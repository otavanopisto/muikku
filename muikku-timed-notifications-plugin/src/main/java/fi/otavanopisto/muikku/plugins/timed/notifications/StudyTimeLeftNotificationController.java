package fi.otavanopisto.muikku.plugins.timed.notifications;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
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
  
  public SearchResult searchActiveStudentIds(Collection<Long> groups, int firstResult, int maxResults, List<SchoolDataIdentifier> excludeSchoolDataIdentifiers, Date studyTimeEndsBefore){
    SearchProvider searchProvider = getProvider("elastic-search");
    return searchProvider.searchUsers(null, null, Collections.singleton(EnvironmentRoleArchetype.STUDENT), groups, null, null, false, true, firstResult, maxResults, Collections.singleton("id"), excludeSchoolDataIdentifiers, null, studyTimeEndsBefore);
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
