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
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.timed.notifications.dao.NoPassedCoursesNotificationDAO;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.NoPassedCoursesNotification;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.GradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScaleItem;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

@Dependent
public class NoPassedCoursesNotificationController {
  
  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private NoPassedCoursesNotificationDAO noPassedCoursesNotificationDAO;
  
  @Inject
  private GradingController gradingController;
  
  public SearchResult searchActiveStudentIds(Collection<Long> groups, int firstResult, int maxResults, List<SchoolDataIdentifier> excludeSchoolDataIdentifiers, Date startedStudiesBefore){
    SearchProvider searchProvider = getProvider("elastic-search");
    return searchProvider.searchUsers(null, null, Collections.singleton(EnvironmentRoleArchetype.STUDENT), groups, null, null, false, true, firstResult, maxResults, Collections.singleton("id"), excludeSchoolDataIdentifiers, startedStudiesBefore);
  }
  
  public int countPassedCoursesByStudentIdentifierSince(SchoolDataIdentifier studentIdentifier, Date since){
    int count = 0;
    List<WorkspaceEntity> workspaceEntities = workspaceUserEntityController.listWorkspaceEntitiesByUserIdentifier(studentIdentifier);
    for (WorkspaceEntity workspaceEntity : workspaceEntities) {
      SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspaceEntity.getIdentifier(), workspaceEntity.getDataSource().getIdentifier());
      List<WorkspaceAssessment> workspaceAssessments = gradingController.listWorkspaceAssessments(workspaceIdentifier, studentIdentifier);
      if (workspaceAssessments != null && !workspaceAssessments.isEmpty()) {
        WorkspaceAssessment assessment = workspaceAssessments.get(0); //TODO: loop and find latest
        if (assessment.getDate().after(since)) {
          GradingScale gradingScale = gradingController.findGradingScale(assessment.getGradingScaleSchoolDataSource(), assessment.getGradingScaleIdentifier());
          GradingScaleItem grade = gradingController.findGradingScaleItem(gradingScale, assessment.getGradeSchoolDataSource(), assessment.getGradeIdentifier());
          if (grade.isPassingGrade()) {
            count++;
          }
        }
      }
    }
    return count;
  }

  public NoPassedCoursesNotification createNoPassedCoursesNotification(SchoolDataIdentifier studentIdentifier){
    return noPassedCoursesNotificationDAO.create(studentIdentifier.toId(), new Date());
  }
  
  public List<SchoolDataIdentifier> listNotifiedSchoolDataIdentifiersAfter(Date date){
    List<SchoolDataIdentifier> results = new ArrayList<>();
    List<NoPassedCoursesNotification> noPassedCoursesNotifications = noPassedCoursesNotificationDAO.listByDateAfter(date);
    for (NoPassedCoursesNotification noPassedCoursesNotification : noPassedCoursesNotifications) {
      results.add(SchoolDataIdentifier.fromId(noPassedCoursesNotification.getStudentIdentifier()));
    }
    return results;
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
