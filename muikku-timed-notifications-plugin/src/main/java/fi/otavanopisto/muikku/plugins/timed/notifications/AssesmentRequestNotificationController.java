package fi.otavanopisto.muikku.plugins.timed.notifications;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.plugins.timed.notifications.dao.AssessmentRequestNotificationDAO;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;
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
  private GradingController gradingController;
  
  @Inject
  private Logger logger;
  
  public List<SchoolDataIdentifier> listStudentsWithoutAssessmentRequestsIn(Collection<Long> groups, int days, int firstResult, int maxResults){
    SearchProvider searchProvider = getProvider("elastic-search");
    List<SchoolDataIdentifier> studentIdentifiers = new ArrayList<>();
    SearchResult results = searchProvider.searchUsers(null, null, Collections.singleton(EnvironmentRoleArchetype.STUDENT), groups, null, null, false, true, firstResult, maxResults, null); //TODO: search only ids
    Date since = new DateTime().minusDays(days).toDate();
    for (Map<String, Object> result : results.getResults()) {
      String studentId = (String) result.get("id");
      
      if (StringUtils.isBlank(studentId)) {
        logger.severe("Could not process user found from search index because it had a null id");
        continue;
      }
      
      String[] studentIdParts = studentId.split("/", 2);
      SchoolDataIdentifier studentIdentifier = studentIdParts.length == 2 ? new SchoolDataIdentifier(studentIdParts[0], studentIdParts[1]) : null;
      if (studentIdentifier == null) {
        logger.severe(String.format("Could not process user found from search index with id %s", studentId));
        continue;
      }
   
      List<WorkspaceAssessmentRequest> assessmentRequests = gradingController.listStudentAssessmentRequestsSince(studentIdentifier, since);
      
      if (assessmentRequests.isEmpty()){
        studentIdentifiers.add(studentIdentifier);
      }
    }
    return studentIdentifiers;
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
