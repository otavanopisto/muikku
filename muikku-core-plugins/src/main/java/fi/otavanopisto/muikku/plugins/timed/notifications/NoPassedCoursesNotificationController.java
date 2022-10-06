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
import fi.otavanopisto.muikku.plugins.timed.notifications.dao.NoPassedCoursesNotificationDAO;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.NoPassedCoursesNotification;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;

@Dependent
public class NoPassedCoursesNotificationController {
  
  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  @Inject
  private NoPassedCoursesNotificationDAO noPassedCoursesNotificationDAO;
  
  @Inject
  private GradingController gradingController;
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;
  
  public SearchResult searchActiveStudents(List<OrganizationEntity> activeOrganizations, Collection<Long> groups, int firstResult, int maxResults, List<SchoolDataIdentifier> excludeSchoolDataIdentifiers, Date startedStudiesBefore){
    SearchProvider searchProvider = getProvider("elastic-search");
    
    return searchProvider.searchUsers(
        activeOrganizations,
        null, // study programme identifiers
        null, // text
        null, // text fields
        Collections.singleton(EnvironmentRoleArchetype.STUDENT), 
        groups, 
        null, 
        null, 
        false,  // include inactive
        true,   // include hidden
        true,   // only default users 
        firstResult, 
        maxResults, 
        null, 
        excludeSchoolDataIdentifiers, 
        startedStudiesBefore,
        false); // join groups and workspaces
  }
  
  public Long countPassedCoursesByStudentIdentifierSince(SchoolDataIdentifier studentIdentifier, Date since) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      return gradingController.countStudentWorkspaceAssessments(studentIdentifier, since, null, true);
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }

  public NoPassedCoursesNotification createNoPassedCoursesNotification(SchoolDataIdentifier studentIdentifier){
    return noPassedCoursesNotificationDAO.create(studentIdentifier.toId(), new Date());
  }
  
  public NoPassedCoursesNotification findLatestByUserIdentifier(SchoolDataIdentifier identifier) {
    return noPassedCoursesNotificationDAO.findLatestByUserIdentifier(identifier);
  }
  
  public List<SchoolDataIdentifier> listNotifiedSchoolDataIdentifiersAfter(Date date) {
    List<SchoolDataIdentifier> results = new ArrayList<>();
    List<NoPassedCoursesNotification> noPassedCoursesNotifications = noPassedCoursesNotificationDAO.listByDateAfter(date);
    for (NoPassedCoursesNotification noPassedCoursesNotification : noPassedCoursesNotifications) {
      results.add(SchoolDataIdentifier.fromId(noPassedCoursesNotification.getStudentIdentifier()));
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
