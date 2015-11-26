package fi.muikku.schooldata;

import java.util.Date;
import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.grading.GradingScaleEntityDAO;
import fi.muikku.dao.grading.GradingScaleItemEntityDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.grading.GradingScaleEntity;
import fi.muikku.model.grading.GradingScaleItemEntity;
import fi.muikku.schooldata.entity.GradingScale;
import fi.muikku.schooldata.entity.GradingScaleItem;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.WorkspaceAssessment;
import fi.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.muikku.schooldata.entity.WorkspaceUser;

@Dependent
@Stateless
public class GradingController {
  
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
	
  public List<WorkspaceAssessment> listWorkspaceAssessments(SchoolDataSource schoolDataSource, String workspaceIdentifier, String studentIdentifier){
    return gradingSchoolDataController.listWorkspaceAssessments(schoolDataSource, workspaceIdentifier, studentIdentifier);
  }
  
  public List<WorkspaceAssessment> listWorkspaceAssessments(String schoolDataSource, String workspaceIdentifier, String studentIdentifier){
    return gradingSchoolDataController.listWorkspaceAssessments(schoolDataSource, workspaceIdentifier, studentIdentifier);
  }
 
  public WorkspaceAssessment updateWorkspaceAssessment(String schoolDataSource, String workspaceAssesmentIdentifier, WorkspaceUser workspaceUser, User assessingUser, GradingScaleItem grade, String verbalAssessment, Date date){
    return gradingSchoolDataController.updateWorkspaceAssessment(schoolDataSource,
       workspaceAssesmentIdentifier,
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

  public WorkspaceAssessmentRequest createWorkspaceAssessmentRequest(String schoolDataSource, String workspaceUserIdentifier, String workspaceUserSchoolDataSource, String workspaceIdentifier,
      String studentIdentifier, String requestText, Date date) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    return gradingSchoolDataController.createWorkspaceAssessmentRequest(schoolDataSource, workspaceUserIdentifier, workspaceUserSchoolDataSource, workspaceIdentifier, studentIdentifier, requestText, date);
  }

  public WorkspaceAssessmentRequest findWorkspaceAssessmentRequest(String schoolDataSource, String identifier, String workspaceIdentifier, String studentIdentifier)
      throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    return gradingSchoolDataController.findWorkspaceAssessmentRequest(schoolDataSource, identifier, workspaceIdentifier, studentIdentifier);
  }

  public List<WorkspaceAssessmentRequest> listWorkspaceAssessmentRequests(String schoolDataSource, String workspaceIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    return gradingSchoolDataController.listWorkspaceAssessmentRequests(schoolDataSource, workspaceIdentifier);
  }

  public List<WorkspaceAssessmentRequest> listWorkspaceAssessmentRequests(String schoolDataSource, String workspaceIdentifier, String studentIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    return gradingSchoolDataController.listWorkspaceAssessmentRequests(schoolDataSource, workspaceIdentifier, studentIdentifier);
  }

  public List<WorkspaceAssessmentRequest> listAssessmentRequestsByStudent(String schoolDataSource, String studentIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    return gradingSchoolDataController.listWorkspaceAssessmentRequests(schoolDataSource, studentIdentifier);
  }

  public WorkspaceAssessmentRequest updateWorkspaceAssessmentRequest(String schoolDataSource, String identifier, String workspaceUserIdentifier, String workspaceUserSchoolDataSource,
      String workspaceIdentifier, String studentIdentifier, String requestText, Date date) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    return gradingSchoolDataController.updateWorkspaceAssessmentRequest(schoolDataSource, identifier, workspaceUserIdentifier, workspaceUserSchoolDataSource, workspaceIdentifier, studentIdentifier, requestText, date);
  }

  public void deleteWorkspaceAssessmentRequest(String schoolDataSource, String identifier, String workspaceIdentifier, String studentIdentifier) {
    gradingSchoolDataController.deleteWorkspaceAssessmentRequest(schoolDataSource, identifier, workspaceIdentifier, studentIdentifier);
  }
  
}
