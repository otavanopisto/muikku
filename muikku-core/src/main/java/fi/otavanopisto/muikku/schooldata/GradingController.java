package fi.otavanopisto.muikku.schooldata;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.dao.grading.GradingScaleEntityDAO;
import fi.otavanopisto.muikku.dao.grading.GradingScaleItemEntityDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.grading.GradingScaleEntity;
import fi.otavanopisto.muikku.model.grading.GradingScaleItemEntity;
import fi.otavanopisto.muikku.schooldata.entity.AssessmentRequest;
import fi.otavanopisto.muikku.schooldata.entity.GradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScaleItem;
import fi.otavanopisto.muikku.schooldata.entity.TransferCredit;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser;

public class GradingController {
  
  @Inject
  private Logger logger;
  
	@Inject
	private GradingSchoolDataController gradingSchoolDataController;

	@Inject
	private GradingScaleEntityDAO gradingScaleEntityDAO;
	
	@Inject
	private GradingScaleItemEntityDAO gradingScaleItemEntityDAO; 

	/* GradingScaleEntity */

	public GradingScaleEntity findGradingScaleEntityById(Long id) {
		return gradingScaleEntityDAO.findById(id);
	}
	
	public GradingScaleEntity findGradingScaleEntityById(SchoolDataSource schoolDataSource, String identifier) {
		return gradingScaleEntityDAO.findByDataSourceAndIdentifier(schoolDataSource, identifier);
	}
	
	public List<GradingScaleEntity> listGradingScaleEntities() {
		return gradingScaleEntityDAO.listAll();
	}

	/* GradingScaleItemEntity */

	public GradingScaleItemEntity findGradingScaleItemEntityById(Long id) {
		return gradingScaleItemEntityDAO.findById(id);
	}
	
	public GradingScaleItemEntity findGradingScaleItemEntityById(SchoolDataSource schoolDataSource, String identifier) {
		return gradingScaleItemEntityDAO.findByDataSourceAndIdentifier(schoolDataSource, identifier);
	}
	
	public List<GradingScaleItemEntity> listGradingScaleItemEntities() {
		return gradingScaleItemEntityDAO.listAll();
	}

	/* GradingScale */

  public GradingScale findGradingScale(GradingScaleEntity entity) {
    return gradingSchoolDataController.findGradingScale(entity.getDataSource(), entity.getIdentifier());
  }

  public GradingScale findGradingScale(String schoolDataSource, String identifier) {
    return gradingSchoolDataController.findGradingScale(schoolDataSource, identifier);
  }

	public List<GradingScale> listGradingScales() {
		return gradingSchoolDataController.listGradingScales();
	}
	
	/* GradingScaleItem */

	public GradingScaleItem findGradingScaleItem(GradingScale gradingScale, GradingScaleItemEntity entity) {
		return gradingSchoolDataController.findGradingScaleItem(entity.getDataSource(), gradingScale, entity.getIdentifier());
	}
	
	public GradingScaleItem findGradingScaleItem(GradingScale gradingScale, String schoolDataSource, String identifier) {
    return gradingSchoolDataController.findGradingScaleItem(schoolDataSource, gradingScale, identifier);
  }

	public List<GradingScaleItem> listGradingScaleItems(GradingScale gradingScale) {
		return gradingSchoolDataController.listGradingScaleItems(gradingScale);
	}
	
	/* Workspace assessment */
	
	public WorkspaceAssessment createWorkspaceAssessment(String schoolDataSource, WorkspaceUser workspaceUser, User assessingUser, GradingScaleItem grade, String verbalAssessment, Date date) {
	  return gradingSchoolDataController.createWorkspaceAssessment(schoolDataSource, 
	      workspaceUser.getIdentifier().getIdentifier(), 
	      workspaceUser.getIdentifier().getDataSource(),
	      workspaceUser.getWorkspaceIdentifier().getIdentifier(), 
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
 
  public WorkspaceAssessment updateWorkspaceAssessment(SchoolDataIdentifier workspaceAssesmentIdentifier, WorkspaceUser workspaceUser, User assessingUser, GradingScaleItem grade, String verbalAssessment, Date date){
    return gradingSchoolDataController.updateWorkspaceAssessment(workspaceAssesmentIdentifier.getDataSource(),
       workspaceAssesmentIdentifier.getIdentifier(),
       workspaceUser.getIdentifier().getIdentifier(),
       workspaceUser.getIdentifier().getDataSource(),
       workspaceUser.getWorkspaceIdentifier().getIdentifier(),
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

  public List<WorkspaceAssessmentRequest> listWorkspaceAssessmentRequests(String schoolDataSource, String workspaceIdentifier, String studentIdentifier) {
    return gradingSchoolDataController.listWorkspaceAssessmentRequests(schoolDataSource, workspaceIdentifier, studentIdentifier);
  }
  
  public List<WorkspaceAssessmentRequest> listStudentAssessmentRequests(SchoolDataIdentifier studentIdentifier) {
    return gradingSchoolDataController.listAssessmentRequestsByStudent(studentIdentifier.getDataSource(), studentIdentifier.getIdentifier());
  }
  
  public List<AssessmentRequest> listAssessmentRequestsByStaffMember(SchoolDataIdentifier staffMemberIdentifier) {
    return gradingSchoolDataController.listAssessmentRequestsByStaffMember(staffMemberIdentifier.getDataSource(), staffMemberIdentifier.getIdentifier());
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
      String workspaceIdentifier, String studentIdentifier, String requestText, Date date) {
    return gradingSchoolDataController.updateWorkspaceAssessmentRequest(schoolDataSource, identifier, workspaceUserIdentifier, workspaceUserSchoolDataSource, workspaceIdentifier, studentIdentifier, requestText, date);
  }

  public void deleteWorkspaceAssessmentRequest(String schoolDataSource, String identifier, String workspaceIdentifier, String studentIdentifier) {
    gradingSchoolDataController.deleteWorkspaceAssessmentRequest(schoolDataSource, identifier, workspaceIdentifier, studentIdentifier);
  }

  public List<TransferCredit> listStudentTransferCredits(SchoolDataIdentifier studentIdentifier) {
    return gradingSchoolDataController.listStudentTransferCredits(studentIdentifier);
  }
  
}
