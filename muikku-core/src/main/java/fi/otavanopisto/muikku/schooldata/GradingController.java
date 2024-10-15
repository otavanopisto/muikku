package fi.otavanopisto.muikku.schooldata;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.schooldata.entity.CompositeAssessmentRequest;
import fi.otavanopisto.muikku.schooldata.entity.CompositeGradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScaleItem;
import fi.otavanopisto.muikku.schooldata.entity.TransferCredit;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceActivityInfo;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceSubject;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser;

public class GradingController {
  
  @Inject
  private Logger logger;
  
  @Inject
  private GradingSchoolDataController gradingSchoolDataController;

  /* Workspace activity */
  
  public WorkspaceActivityInfo listWorkspaceActivities(String schoolDataSource, String studentIdentifier, String workspaceIdentifier, boolean includeTransferCredits) {
    return gradingSchoolDataController.listWorkspaceActivities(schoolDataSource, studentIdentifier, workspaceIdentifier, includeTransferCredits);
  }
  
  /* CompositeGradingScale */
  
  public List<CompositeGradingScale> listCompositeGradingScales() {
    return gradingSchoolDataController.listCompositeGradingScales();
  }

  /* GradingScale */

  public GradingScale findGradingScale(String schoolDataSource, String identifier) {
    return gradingSchoolDataController.findGradingScale(schoolDataSource, identifier);
  }

  public GradingScale findGradingScale(SchoolDataIdentifier identifier) {
    return gradingSchoolDataController.findGradingScale(identifier.getDataSource(), identifier.getIdentifier());
  }

  public List<GradingScale> listGradingScales() {
    return gradingSchoolDataController.listGradingScales();
  }
  
  /* GradingScaleItem */

  public GradingScaleItem findGradingScaleItem(GradingScale gradingScale, String schoolDataSource, String identifier) {
    return gradingSchoolDataController.findGradingScaleItem(schoolDataSource, gradingScale, identifier);
  }

  public GradingScaleItem findGradingScaleItem(GradingScale gradingScale, SchoolDataIdentifier identifier) {
    if (identifier == null) {
      return null;
    }  
    return gradingSchoolDataController.findGradingScaleItem(identifier.getDataSource(), gradingScale, identifier.getIdentifier());
  }

  public List<GradingScaleItem> listGradingScaleItems(GradingScale gradingScale) {
    return gradingSchoolDataController.listGradingScaleItems(gradingScale);
  }
  
  /* Workspace assessment */
  
  public WorkspaceAssessment createWorkspaceAssessment(String schoolDataSource, WorkspaceUser workspaceUser, WorkspaceSubject workspaceSubject, User assessingUser, GradingScaleItem grade, String verbalAssessment, Date date) {
    return gradingSchoolDataController.createWorkspaceAssessment(schoolDataSource, 
        workspaceUser.getIdentifier().getIdentifier(), 
        workspaceUser.getIdentifier().getDataSource(),
        workspaceUser.getWorkspaceIdentifier().getIdentifier(),
        workspaceSubject.getIdentifier().getIdentifier(),
        workspaceUser.getUserIdentifier().getIdentifier(),
        assessingUser.getIdentifier(), 
        assessingUser.getSchoolDataSource(), 
        grade.getIdentifier(), 
        grade.getSchoolDataSource(),
        grade.getGradingScaleIdentifier(),
        grade.getSchoolDataSource(),
        verbalAssessment,
        date);
  }

  public fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment findWorkspaceAssessment(
      SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier studentIdentifier,
      SchoolDataIdentifier workspaceAssesmentIdentifier) {
    return gradingSchoolDataController.findWorkspaceAssessment(workspaceIdentifier, studentIdentifier, workspaceAssesmentIdentifier);
  }
  
  public List<WorkspaceAssessment> listWorkspaceAssessments(SchoolDataSource schoolDataSource, String workspaceIdentifier, String studentIdentifier){
    return gradingSchoolDataController.listWorkspaceAssessments(schoolDataSource, workspaceIdentifier, studentIdentifier);
  }
  
  public List<WorkspaceAssessment> listWorkspaceAssessments(String schoolDataSource, String workspaceIdentifier, String studentIdentifier){
    return gradingSchoolDataController.listWorkspaceAssessments(schoolDataSource, workspaceIdentifier, studentIdentifier);
  }

  public List<WorkspaceAssessment> listWorkspaceAssessments(SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier studentIdentifier) {
    if (!StringUtils.equals(workspaceIdentifier.getDataSource(), studentIdentifier.getDataSource())) {
      logger.log(Level.SEVERE, String.format("Failed to list workspace assessents because workspace and student datasources differ", workspaceIdentifier.getDataSource(), studentIdentifier.getDataSource()));
      return Collections.emptyList();
    }
    
    return gradingSchoolDataController.listWorkspaceAssessments(studentIdentifier.getDataSource(), workspaceIdentifier.getIdentifier(), studentIdentifier.getIdentifier());
  }

  /**
   * Lists all assessments for student. Note that they may contain assessments pointed to 
   * the same workspace.
   * 
   * @param studentIdentifier
   * @return
   */
  public List<WorkspaceAssessment> listAssessmentsByStudent(SchoolDataIdentifier studentIdentifier) {
    return gradingSchoolDataController.listAssessmentsByStudent(studentIdentifier.getDataSource(), studentIdentifier.getIdentifier());
  }  
  
  public WorkspaceAssessment findLatestWorkspaceAssessment(SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier studentIdentifier) {
    List<WorkspaceAssessment> workspaceAssessments = listWorkspaceAssessments(workspaceIdentifier, studentIdentifier);
    workspaceAssessments.sort((WorkspaceAssessment a, WorkspaceAssessment b) -> {
      if (a == null) {
        return -1;
      }
      if (b == null) {
        return 1;
      }
      return a.getDate().compareTo(b.getDate());
    });
    if (workspaceAssessments.isEmpty()) {
      return null;
    } else {
      return workspaceAssessments.get(workspaceAssessments.size()-1);
    }
  }
 
  public WorkspaceAssessment updateWorkspaceAssessment(SchoolDataIdentifier workspaceAssesmentIdentifier, WorkspaceUser workspaceUser, WorkspaceSubject workspaceSubject, User assessingUser, GradingScaleItem grade, String verbalAssessment, Date date){
    return gradingSchoolDataController.updateWorkspaceAssessment(workspaceAssesmentIdentifier.getDataSource(),
       workspaceAssesmentIdentifier.getIdentifier(),
       workspaceUser.getIdentifier().getIdentifier(),
       workspaceUser.getIdentifier().getDataSource(),
       workspaceUser.getWorkspaceIdentifier().getIdentifier(),
       workspaceSubject.getIdentifier().getIdentifier(),
       workspaceUser.getUserIdentifier().getIdentifier(),
       assessingUser.getIdentifier(),
       assessingUser.getSchoolDataSource(),
       grade.getIdentifier(),
       grade.getSchoolDataSource(),
       grade.getGradingScaleIdentifier(),
       grade.getSchoolDataSource(),
       verbalAssessment,
       date);
  }

  public void deleteWorkspaceAssessment(SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier studentIdentifier, SchoolDataIdentifier workspaceAssesmentIdentifier) {
    gradingSchoolDataController.deleteWorkspaceAssessment(workspaceIdentifier, studentIdentifier, workspaceAssesmentIdentifier);
  }
  
  public void restoreLatestAssessmentRequest(SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier studentIdentifier, Boolean archived) {
    List<WorkspaceAssessmentRequest> requests = listWorkspaceAssessmentRequests(workspaceIdentifier.getDataSource(), workspaceIdentifier.getIdentifier(), studentIdentifier.getIdentifier(), archived);
    if (CollectionUtils.isNotEmpty(requests)) {
      requests.sort(new Comparator<WorkspaceAssessmentRequest>() {
        public int compare(WorkspaceAssessmentRequest o1, WorkspaceAssessmentRequest o2) {
          return o2.getDate().compareTo(o1.getDate()); // latest request first
        }
      });
      // Mark the latest request as not handled
      WorkspaceAssessmentRequest latestRequest = requests.get(0);
      updateWorkspaceAssessmentRequest(
          latestRequest.getSchoolDataSource(),
          latestRequest.getIdentifier(),
          latestRequest.getWorkspaceUserIdentifier(),
          latestRequest.getWorkspaceUserSchoolDataSource(),
          workspaceIdentifier.getIdentifier(),
          studentIdentifier.getIdentifier(),
          latestRequest.getRequestText(),
          latestRequest.getDate(),
          latestRequest.getArchived(),
          Boolean.FALSE, // not handled
          latestRequest.getLocked());
    }
  }

  public WorkspaceAssessmentRequest createWorkspaceAssessmentRequest(String schoolDataSource, String workspaceUserIdentifier, String workspaceUserSchoolDataSource, String workspaceIdentifier,
      String studentIdentifier, String requestText, Date date) {
    return gradingSchoolDataController.createWorkspaceAssessmentRequest(schoolDataSource, workspaceUserIdentifier, workspaceUserSchoolDataSource, workspaceIdentifier, studentIdentifier, requestText, date);
  }

  public WorkspaceAssessmentRequest findWorkspaceAssessmentRequest(String schoolDataSource, String identifier, String workspaceIdentifier, String studentIdentifier) {
    return gradingSchoolDataController.findWorkspaceAssessmentRequest(schoolDataSource, identifier, workspaceIdentifier, studentIdentifier);
  }

  public List<WorkspaceAssessmentRequest> listWorkspaceAssessmentRequests(String schoolDataSource, String workspaceIdentifier) {
    return gradingSchoolDataController.listWorkspaceAssessmentRequests(schoolDataSource, workspaceIdentifier);
  }

  public List<WorkspaceAssessmentRequest> listWorkspaceAssessmentRequests(String schoolDataSource, String workspaceIdentifier, String studentIdentifier, Boolean archived) {
    return gradingSchoolDataController.listWorkspaceAssessmentRequests(schoolDataSource, workspaceIdentifier, studentIdentifier, archived);
  }
  
  public List<WorkspaceAssessmentRequest> listStudentAssessmentRequests(SchoolDataIdentifier studentIdentifier) {
    return gradingSchoolDataController.listAssessmentRequestsByStudent(studentIdentifier.getDataSource(), studentIdentifier.getIdentifier());
  }
  
  public List<CompositeAssessmentRequest> listAssessmentRequestsByWorkspace(SchoolDataIdentifier workspaceIdentifier, List<String> workspaceStudentIdentifiers) {
    return gradingSchoolDataController.listCompositeAssessmentRequestsByWorkspace(workspaceIdentifier.getDataSource(), workspaceIdentifier.getIdentifier(), workspaceStudentIdentifiers);
  }

  public Long countStudentWorkspaceAssessments(SchoolDataIdentifier studentIdentifier, Date fromDate, Date toDate, boolean onlyPassingGrades) {
    return gradingSchoolDataController.countStudentWorkspaceAssessments(
        studentIdentifier.getDataSource(), studentIdentifier.getIdentifier(), fromDate, toDate, onlyPassingGrades);
  }

  public List<CompositeAssessmentRequest> listAssessmentRequestsByStaffMember(SchoolDataIdentifier staffMemberIdentifier) {
    return gradingSchoolDataController.listCompositeAssessmentRequestsByStaffMember(staffMemberIdentifier.getDataSource(), staffMemberIdentifier.getIdentifier());
  }
  
  public WorkspaceAssessment findLatestWorkspaceAssessmentByIdentifier(SchoolDataIdentifier studentIdentifier) {
    return gradingSchoolDataController.findLatestWorkspaceAssessmentByStudent(studentIdentifier.getDataSource(), studentIdentifier.getIdentifier());
  }

  public WorkspaceAssessmentRequest findLatestAssessmentRequestByIdentifier(SchoolDataIdentifier studentIdentifier) {
    return gradingSchoolDataController.findLatestAssessmentRequestByStudent(studentIdentifier.getDataSource(), studentIdentifier.getIdentifier());
  }
  
  public WorkspaceAssessmentRequest findLatestAssessmentRequestByWorkspaceAndStudent(SchoolDataIdentifier studentIdentifier, SchoolDataIdentifier workspaceIdentifier) {
    return gradingSchoolDataController.findLatestAssessmentRequestByWorkspaceAndStudent(studentIdentifier.getDataSource(), workspaceIdentifier.getIdentifier(), studentIdentifier.getIdentifier());
  }
  
  public List<WorkspaceAssessmentRequest> listStudentAssessmentRequestsSince(SchoolDataIdentifier studentIdentifier, Date date) {
    List<WorkspaceAssessmentRequest> result = new ArrayList<>();
    for (WorkspaceAssessmentRequest workspaceAssessmentRequest : listStudentAssessmentRequests(studentIdentifier)) {
      Date workspaceAssessmentRequestDate = workspaceAssessmentRequest.getDate();
      if (workspaceAssessmentRequestDate != null && workspaceAssessmentRequest.getDate().after(date)) {
        result.add(workspaceAssessmentRequest);
      }
    }
    return result;
  }
  
  public WorkspaceAssessmentRequest updateWorkspaceAssessmentRequest(String schoolDataSource, String identifier, String workspaceUserIdentifier, String workspaceUserSchoolDataSource,
      String workspaceIdentifier, String studentIdentifier, String requestText, Date date, Boolean archived, Boolean handled, Boolean locked) {
    return gradingSchoolDataController.updateWorkspaceAssessmentRequest(
        schoolDataSource,
        identifier,
        workspaceUserIdentifier,
        workspaceUserSchoolDataSource,
        workspaceIdentifier,
        studentIdentifier,
        requestText,
        date,
        archived,
        handled,
        locked);
  }
  
  public WorkspaceAssessmentRequest updateWorkspaceAssessmentLock(String schoolDataSource, String identifier, String workspaceUserIdentifier, String workspaceUserSchoolDataSource,
      String workspaceIdentifier, String studentIdentifier, boolean locked) {
    return gradingSchoolDataController.updateWorkspaceAssessmentRequestLock(
        schoolDataSource,
        identifier,
        workspaceUserIdentifier,
        workspaceUserSchoolDataSource,
        workspaceIdentifier,
        studentIdentifier,
        locked);
  }

  public void deleteWorkspaceAssessmentRequest(String schoolDataSource, String identifier, String workspaceIdentifier, String studentIdentifier) {
    gradingSchoolDataController.deleteWorkspaceAssessmentRequest(schoolDataSource, identifier, workspaceIdentifier, studentIdentifier);
  }

  public List<TransferCredit> listStudentTransferCredits(SchoolDataIdentifier studentIdentifier) {
    return gradingSchoolDataController.listStudentTransferCredits(studentIdentifier);
  }
  
}
