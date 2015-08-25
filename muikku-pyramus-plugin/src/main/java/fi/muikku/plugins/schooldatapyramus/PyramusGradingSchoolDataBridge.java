package fi.muikku.plugins.schooldatapyramus;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;
import org.joda.time.DateTime;

import fi.muikku.plugins.schooldatapyramus.entities.PyramusGradingScale;
import fi.muikku.plugins.schooldatapyramus.entities.PyramusGradingScaleItem;
import fi.muikku.plugins.schooldatapyramus.entities.PyramusSchoolDataEntityFactory;
import fi.muikku.plugins.schooldatapyramus.rest.PyramusClient;
import fi.muikku.schooldata.GradingSchoolDataBridge;
import fi.muikku.schooldata.SchoolDataBridgeRequestException;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.entity.GradingScale;
import fi.muikku.schooldata.entity.GradingScaleItem;
import fi.muikku.schooldata.entity.WorkspaceAssessment;
import fi.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.pyramus.rest.model.CourseAssessment;
import fi.pyramus.rest.model.CourseAssessmentRequest;
import fi.pyramus.rest.model.Grade;

public class PyramusGradingSchoolDataBridge implements GradingSchoolDataBridge {

  @Inject
  private PyramusClient pyramusClient;
  
  @Inject
  private PyramusIdentifierMapper identifierMapper;
  
  @Inject
  private PyramusSchoolDataEntityFactory entityFactory;
  
  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

	@Override
	public GradingScale findGradingScale(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (!NumberUtils.isNumber(identifier)) {
			throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
		}

    return createGradingScaleEntity(pyramusClient.get("/common/gradingScales/" + identifier, fi.pyramus.rest.model.GradingScale.class));
	}

	@Override
	public List<GradingScale> listGradingScales() throws UnexpectedSchoolDataBridgeException {
	  fi.pyramus.rest.model.GradingScale[] gradingScales = pyramusClient.get("/common/gradingScales/?filterArchived=true", fi.pyramus.rest.model.GradingScale[].class);
    if (gradingScales == null) {
      throw new UnexpectedSchoolDataBridgeException("Null response");
    }
    
    return createGradingScaleEntities(gradingScales);
	}

	@Override
	public GradingScaleItem findGradingScaleItem(String gradingScaleIdentifier, String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (!NumberUtils.isNumber(identifier) || !NumberUtils.isNumber(gradingScaleIdentifier)) {
			throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
		}

    return createGradingScaleItemEntity(pyramusClient.get("/common/gradingScales/" + gradingScaleIdentifier + "/grades/" + identifier, fi.pyramus.rest.model.Grade.class));
	}

	@Override
	public List<GradingScaleItem> listGradingScaleItems(String gradingScaleIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {

    Grade[] grades = pyramusClient.get("/common/gradingScales/" + gradingScaleIdentifier + "/grades", Grade[].class);
    if (grades == null) {
      throw new UnexpectedSchoolDataBridgeException("Null response");
    }
    
    return createGradingScaleItemEntities(grades);
	}

  private GradingScaleItem createGradingScaleItemEntity(Grade grade) {
    if (grade == null) {
      return null;
    }
    
    return new PyramusGradingScaleItem(grade.getId().toString(), grade.getGradingScaleId().toString(), grade.getName(), grade.getPassingGrade());
  }

  private List<GradingScaleItem> createGradingScaleItemEntities(Grade[] grades) {
    List<GradingScaleItem> result = new ArrayList<>();

    for (Grade g : grades)
      result.add(createGradingScaleItemEntity(g));
      
    return result;
  }

  private GradingScale createGradingScaleEntity(fi.pyramus.rest.model.GradingScale g) {
    if (g == null) {
      return null;
    }
    
    return new PyramusGradingScale(g.getId().toString(), g.getName());
  }

  private List<GradingScale> createGradingScaleEntities(fi.pyramus.rest.model.GradingScale[] gradingScales) {
    List<GradingScale> result = new ArrayList<>();

    for (fi.pyramus.rest.model.GradingScale g : gradingScales)
      result.add(createGradingScaleEntity(g));
      
    return result;
  }

  @Override
  public WorkspaceAssessment createWorkspaceAssessment(String workspaceUserIdentifier, String workspaceUserSchoolDataSource, String workspaceIdentifier, String studentIdentifier, String assessingUserIdentifier,
      String assessingUserSchoolDataSource, String gradeIdentifier, String gradeSchoolDataSource, String gradingScaleIdentifier, String gradingScaleSchoolDataSource, String verbalAssessment, Date date)
      throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    
    long courseStudentId = identifierMapper.getPyramusCourseStudentId(workspaceUserIdentifier);
    long assessingUserId = identifierMapper.getPyramusStaffId(assessingUserIdentifier);
    long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    
    CourseAssessment courseAssessment = new CourseAssessment(null, courseStudentId, Long.parseLong(gradeIdentifier), Long.parseLong(gradingScaleIdentifier), assessingUserId, new DateTime(date), verbalAssessment);
    return entityFactory.createEntity(pyramusClient.post(String.format("/students/students/%d/courses/%d/assessments/", studentId, courseId ), courseAssessment));
  }

  @Override
  public WorkspaceAssessment findWorkspaceAssessment(String identifier, String workspaceIdentifier, String studentIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    long id = Long.parseLong(identifier);
    return entityFactory.createEntity(pyramusClient.get(String.format("/students/students/%d/courses/%d/assessments/%d", studentId, courseId, id ), CourseAssessment.class));
  }

  @Override
  public WorkspaceAssessment updateWorkspaceAssessment(String identifier, String workspaceUserIdentifier, String workspaceUserSchoolDataSource, String workspaceIdentifier, String studentIdentifier,
      String assessingUserIdentifier, String assessingUserSchoolDataSource, String gradeIdentifier, String gradeSchoolDataSource, String gradingScaleIdentifier, String gradingScaleSchoolDataSource, String verbalAssessment,
      Date date) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {

    long courseStudentId = identifierMapper.getPyramusCourseStudentId(workspaceUserIdentifier);
    long assessingUserId = identifierMapper.getPyramusStaffId(assessingUserIdentifier);
    long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    long id = Long.parseLong(identifier);
    
    CourseAssessment courseAssessment = new CourseAssessment(id, courseStudentId, Long.parseLong(gradeIdentifier), Long.parseLong(gradingScaleIdentifier), assessingUserId, new DateTime(date), verbalAssessment);
    return entityFactory.createEntity(pyramusClient.put(String.format("/students/students/%d/courses/%d/assessments/%d", studentId, courseId, id), courseAssessment));
  }

  @Override
  public List<WorkspaceAssessment> listWorkspaceAssessments(String workspaceIdentifier, String studentIdentifier) throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    return entityFactory.createEntity(pyramusClient.get(String.format("/students/students/%d/courses/%d/assessments/", studentId, courseId), CourseAssessment[].class));
  }

  @Override
  public WorkspaceAssessmentRequest createWorkspaceAssessmentRequest(String workspaceUserIdentifier,
      String workspaceUserSchoolDataSource, String workspaceIdentifier, String studentIdentifier, String requestText,
      Date date) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    long courseStudentId = identifierMapper.getPyramusCourseStudentId(workspaceUserIdentifier);
    long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    
    CourseAssessmentRequest courseAssessmentRequest = new CourseAssessmentRequest(null, courseStudentId, new DateTime(date), requestText, Boolean.FALSE);
    return entityFactory.createEntity(pyramusClient.post(String.format("/students/students/%d/courses/%d/assessmentRequests/", studentId, courseId), courseAssessmentRequest));
  }

  @Override
  public WorkspaceAssessmentRequest findWorkspaceAssessmentRequest(String identifier, String workspaceIdentifier,
      String studentIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    long id = Long.parseLong(identifier);
    return entityFactory.createEntity(pyramusClient.get(String.format("/students/students/%d/courses/%d/assessmentRequests/%d", studentId, courseId, id), CourseAssessmentRequest.class));
  }

  @Override
  public List<WorkspaceAssessmentRequest> listWorkspaceAssessmentRequests(String workspaceIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    return entityFactory.createEntity(pyramusClient.get(String.format("/courses/courses/%d/courses/%d/assessmentRequests/", courseId), CourseAssessmentRequest[].class));
  }

  @Override
  public List<WorkspaceAssessmentRequest> listWorkspaceAssessmentRequests(String workspaceIdentifier,
      String studentIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    return entityFactory.createEntity(pyramusClient.get(String.format("/students/students/%d/courses/%d/assessmentRequests/", studentId, courseId), CourseAssessmentRequest[].class));
  }

  @Override
  public List<WorkspaceAssessmentRequest> listAssessmentRequestsByStudent(String studentIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    return entityFactory.createEntity(pyramusClient.get(String.format("/students/students/%d/assessmentRequests/", studentId), CourseAssessmentRequest[].class));
  }
  
  @Override
  public WorkspaceAssessmentRequest updateWorkspaceAssessmentRequest(String identifier, String workspaceUserIdentifier,
      String workspaceUserSchoolDataSource, String workspaceIdentifier, String studentIdentifier,
      String requestText, Date date) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    long courseStudentId = identifierMapper.getPyramusCourseStudentId(workspaceUserIdentifier);
    long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    long id = Long.parseLong(identifier);
    
    CourseAssessmentRequest courseAssessmentRequest = new CourseAssessmentRequest(id, courseStudentId, new DateTime(date), requestText, Boolean.FALSE);
    return entityFactory.createEntity(pyramusClient.put(String.format("/students/students/%d/courses/%d/assessmentRequests/%d", studentId, courseId, id), courseAssessmentRequest));
  }

  @Override
  public void deleteWorkspaceAssessmentRequest(String identifier, String workspaceIdentifier, String studentIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);

    pyramusClient.delete(String.format("/students/students/%d/courses/%d/assessmentRequests/%s", studentId, courseId, identifier));
  }

}
