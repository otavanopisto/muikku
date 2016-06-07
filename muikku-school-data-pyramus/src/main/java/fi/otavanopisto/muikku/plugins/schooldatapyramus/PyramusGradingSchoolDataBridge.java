package fi.otavanopisto.muikku.plugins.schooldatapyramus;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;
import org.joda.time.DateTime;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusGradingScale;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusGradingScaleItem;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusSchoolDataEntityFactory;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.PyramusClient;
import fi.otavanopisto.muikku.schooldata.GradingSchoolDataBridge;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeRequestException;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.otavanopisto.muikku.schooldata.entity.GradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScaleItem;
import fi.otavanopisto.muikku.schooldata.entity.TransferCredit;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.otavanopisto.pyramus.rest.model.CourseAssessment;
import fi.otavanopisto.pyramus.rest.model.CourseAssessmentRequest;
import fi.otavanopisto.pyramus.rest.model.CourseStudent;
import fi.otavanopisto.pyramus.rest.model.Grade;

public class PyramusGradingSchoolDataBridge implements GradingSchoolDataBridge {

  @Inject
  private Logger logger;
  
  @Inject
  private PyramusClient pyramusClient;
  
  @Inject
  private PyramusIdentifierMapper identifierMapper;
  
  @Inject
  private PyramusSchoolDataEntityFactory entityFactory;
  
  @Inject
  private CourseParticipationTypeEvaluationMapper courseParticipationTypeEvaluationMapper;
  
  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

	@Override
	public GradingScale findGradingScale(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (!NumberUtils.isNumber(identifier)) {
			throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
		}

    return createGradingScaleEntity(pyramusClient.get("/common/gradingScales/" + identifier, fi.otavanopisto.pyramus.rest.model.GradingScale.class));
	}

	@Override
	public List<GradingScale> listGradingScales() throws UnexpectedSchoolDataBridgeException {
	  fi.otavanopisto.pyramus.rest.model.GradingScale[] gradingScales = pyramusClient.get("/common/gradingScales/?filterArchived=true", fi.otavanopisto.pyramus.rest.model.GradingScale[].class);
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

    return createGradingScaleItemEntity(pyramusClient.get("/common/gradingScales/" + gradingScaleIdentifier + "/grades/" + identifier, fi.otavanopisto.pyramus.rest.model.Grade.class));
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

  private GradingScale createGradingScaleEntity(fi.otavanopisto.pyramus.rest.model.GradingScale g) {
    if (g == null) {
      return null;
    }
    
    return new PyramusGradingScale(g.getId().toString(), g.getName());
  }

  private List<GradingScale> createGradingScaleEntities(fi.otavanopisto.pyramus.rest.model.GradingScale[] gradingScales) {
    List<GradingScale> result = new ArrayList<>();

    for (fi.otavanopisto.pyramus.rest.model.GradingScale g : gradingScales)
      result.add(createGradingScaleEntity(g));
      
    return result;
  }

  @Override
  public WorkspaceAssessment createWorkspaceAssessment(String workspaceUserIdentifier, String workspaceUserSchoolDataSource, String workspaceIdentifier, String studentIdentifier, String assessingUserIdentifier,
      String assessingUserSchoolDataSource, String gradeIdentifier, String gradeSchoolDataSource, String gradingScaleIdentifier, String gradingScaleSchoolDataSource, String verbalAssessment, Date date)
      throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    
    Long courseStudentId = identifierMapper.getPyramusCourseStudentId(workspaceUserIdentifier);
    Long assessingUserId = identifierMapper.getPyramusStaffId(assessingUserIdentifier);
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    Long gradeId = identifierMapper.getPyramusGradeId(gradeIdentifier);
    Long gradingScaleId = identifierMapper.getPyramusGradingScaleId(gradingScaleIdentifier);
    
    if (courseStudentId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus course student", workspaceUserIdentifier));
      return null; 
    }

    if (assessingUserId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus staff member", assessingUserIdentifier));
      return null; 
    }
    
    if (courseId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus course", workspaceIdentifier));
      return null; 
    }
    
    if (studentId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus student", studentIdentifier));
      return null; 
    }
    
    if (gradeId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus grade", gradeIdentifier));
      return null; 
    }
    
    if (gradingScaleId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus grading scale", gradingScaleIdentifier));
      return null; 
    }
 
    Grade grade = pyramusClient.get(String.format("/common/gradingScales/%d/grades/%d", gradingScaleId, gradeId), fi.otavanopisto.pyramus.rest.model.Grade.class);
    if (grade == null) {
      logger.severe(String.format("Could not create workspace assessment because grade %d could not be found from Pyramus", gradeId));
      return null; 
    }
    
    CourseAssessment courseAssessment = new CourseAssessment(null, courseStudentId, gradeId, gradingScaleId, assessingUserId, new DateTime(date), verbalAssessment);
    WorkspaceAssessment workspaceAssessment = entityFactory.createEntity(pyramusClient.post(String.format("/students/students/%d/courses/%d/assessments/", studentId, courseId ), courseAssessment));
    updateParticipationTypeByGrade(courseStudentId, courseId, grade);
    
    return workspaceAssessment;
  }

  @Override
  public WorkspaceAssessment findWorkspaceAssessment(String identifier, String workspaceIdentifier, String studentIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    Long id = Long.parseLong(identifier);
    if (courseId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus course", workspaceIdentifier));
      return null; 
    }
    if (studentId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus student", studentIdentifier));
      return null; 
    }
    if (id == null) {
      logger.severe(String.format("Could not translate %s to Pyramus assessment", identifier));
      return null; 
    }
    return entityFactory.createEntity(pyramusClient.get(String.format("/students/students/%d/courses/%d/assessments/%d", studentId, courseId, id ), CourseAssessment.class));
  }

  @Override
  public WorkspaceAssessment updateWorkspaceAssessment(String identifier, String workspaceUserIdentifier, String workspaceUserSchoolDataSource, String workspaceIdentifier, String studentIdentifier,
      String assessingUserIdentifier, String assessingUserSchoolDataSource, String gradeIdentifier, String gradeSchoolDataSource, String gradingScaleIdentifier, String gradingScaleSchoolDataSource, String verbalAssessment,
      Date date) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {

    Long courseStudentId = identifierMapper.getPyramusCourseStudentId(workspaceUserIdentifier);
    Long assessingUserId = identifierMapper.getPyramusStaffId(assessingUserIdentifier);
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    Long id = Long.parseLong(identifier);
    Long gradeId = identifierMapper.getPyramusGradeId(gradeIdentifier);
    Long gradingScaleId = identifierMapper.getPyramusGradingScaleId(gradingScaleIdentifier);
    
    if (courseStudentId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus course student", workspaceUserIdentifier));
      return null; 
    }

    if (assessingUserId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus staff member", assessingUserIdentifier));
      return null; 
    }
    
    if (courseId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus course", workspaceIdentifier));
      return null; 
    }
    
    if (studentId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus student", studentIdentifier));
      return null; 
    }

    if (id == null) {
      logger.severe(String.format("Could not translate %s to Pyramus assessment", identifier));
      return null; 
    }
    
    if (gradeId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus grade", gradeIdentifier));
      return null; 
    }
    
    if (gradingScaleId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus grading scale", gradingScaleIdentifier));
      return null; 
    }
 
    Grade grade = pyramusClient.get(String.format("/common/gradingScales/%d/grades/%d", gradingScaleId, gradeId), fi.otavanopisto.pyramus.rest.model.Grade.class);
    if (grade == null) {
      logger.severe(String.format("Could not update workspace assessment because grade %d could not be found from Pyramus", gradeId));
      return null; 
    }
    
    CourseAssessment courseAssessment = new CourseAssessment(id, courseStudentId, gradeId, gradingScaleId, assessingUserId, new DateTime(date), verbalAssessment);
    updateParticipationTypeByGrade(courseStudentId, courseId, grade);
    
    return entityFactory.createEntity(pyramusClient.put(String.format("/students/students/%d/courses/%d/assessments/%d", studentId, courseId, id), courseAssessment));
  }

  @Override
  public List<WorkspaceAssessment> listWorkspaceAssessments(String workspaceIdentifier, String studentIdentifier) throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    if (courseId == null || studentId == null) {
      logger.severe(String.format("Unable to resolve workspace %s or student %s", workspaceIdentifier, studentIdentifier));
      return Collections.emptyList();
    }
    else {
      return entityFactory.createEntity(pyramusClient.get(String.format("/students/students/%d/courses/%d/assessments/", studentId, courseId), CourseAssessment[].class));
    }
  }

  @Override
  public WorkspaceAssessmentRequest createWorkspaceAssessmentRequest(String workspaceUserIdentifier,
      String workspaceUserSchoolDataSource, String workspaceIdentifier, String studentIdentifier, String requestText,
      Date date) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    Long courseStudentId = identifierMapper.getPyramusCourseStudentId(workspaceUserIdentifier);
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    if (courseStudentId == null || courseId == null || studentId == null) {
      logger.severe(String.format("Unable to resolve workspace user %s workspace %s or student %s", workspaceUserIdentifier, workspaceIdentifier, studentIdentifier));
      return null;
    }
    else {
      CourseAssessmentRequest courseAssessmentRequest = new CourseAssessmentRequest(null, courseStudentId, new DateTime(date), requestText, Boolean.FALSE);
      return entityFactory.createEntity(pyramusClient.post(String.format("/students/students/%d/courses/%d/assessmentRequests/", studentId, courseId), courseAssessmentRequest));
    }
  }

  @Override
  public WorkspaceAssessmentRequest findWorkspaceAssessmentRequest(String identifier, String workspaceIdentifier,
      String studentIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    Long id = Long.parseLong(identifier);
    
    if ((courseId != null) && (studentId != null) && (id != null)) {
      return entityFactory.createEntity(pyramusClient.get(String.format("/students/students/%d/courses/%d/assessmentRequests/%d", studentId, courseId, id), CourseAssessmentRequest.class));
    } else {
      logger.log(Level.SEVERE, String.format("Could not find WorkspaceAssessmentRequest for courseId %d, studentId %d, id %d", courseId, studentId, id));
      return null;
    }
  }

  @Override
  public List<WorkspaceAssessmentRequest> listWorkspaceAssessmentRequests(String workspaceIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    if (courseId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus course", workspaceIdentifier));
      return null; 
    }
    return entityFactory.createEntity(pyramusClient.get(String.format("/courses/courses/%d/assessmentsRequests/?activeStudents=true", courseId), CourseAssessmentRequest[].class));
  }

  @Override
  public List<WorkspaceAssessmentRequest> listWorkspaceAssessmentRequests(String workspaceIdentifier,
      String studentIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    if (courseId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus course", workspaceIdentifier));
      return null; 
    }
    if (studentId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus student", studentIdentifier));
      return null; 
    }
    return entityFactory.createEntity(pyramusClient.get(String.format("/students/students/%d/courses/%d/assessmentRequests/", studentId, courseId), CourseAssessmentRequest[].class));
  }

  @Override
  public List<WorkspaceAssessmentRequest> listAssessmentRequestsByStudent(String studentIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    if (studentId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus student", studentIdentifier));
      return null; 
    }
    return entityFactory.createEntity(pyramusClient.get(String.format("/students/students/%d/assessmentRequests/", studentId), CourseAssessmentRequest[].class));
  }
  
  @Override
  public WorkspaceAssessmentRequest updateWorkspaceAssessmentRequest(String identifier, String workspaceUserIdentifier,
      String workspaceUserSchoolDataSource, String workspaceIdentifier, String studentIdentifier,
      String requestText, Date date) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    Long courseStudentId = identifierMapper.getPyramusCourseStudentId(workspaceUserIdentifier);
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    Long id = Long.parseLong(identifier);
    if (courseStudentId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus course student", workspaceUserIdentifier));
      return null; 
    }
    if (courseId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus course", workspaceIdentifier));
      return null; 
    }
    if (studentId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus student", studentIdentifier));
      return null; 
    }
    if (id == null) {
      logger.severe(String.format("Could not translate %s to Pyramus assessment", identifier));
      return null; 
    }
    CourseAssessmentRequest courseAssessmentRequest = new CourseAssessmentRequest(id, courseStudentId, new DateTime(date), requestText, Boolean.FALSE);
    return entityFactory.createEntity(pyramusClient.put(String.format("/students/students/%d/courses/%d/assessmentRequests/%d", studentId, courseId, id), courseAssessmentRequest));
  }

  @Override
  public void deleteWorkspaceAssessmentRequest(String identifier, String workspaceIdentifier, String studentIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    if (courseId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus course", workspaceIdentifier));
    }
    else if (studentId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus student", studentIdentifier));
    }
    else {
      pyramusClient.delete(String.format("/students/students/%d/courses/%d/assessmentRequests/%s", studentId, courseId, identifier));
    }
  }

  @Override
  public List<TransferCredit> listStudentTransferCredits(SchoolDataIdentifier studentIdentifier) {
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());
    if (studentId == null) {
      logger.severe(String.format("Failed to convert %s into Pyramus student id", studentIdentifier));
      return Collections.emptyList();
    }
    
    fi.otavanopisto.pyramus.rest.model.TransferCredit[] transferCredits = pyramusClient.get(String.format("/students/students/%d/transferCredits", studentId), fi.otavanopisto.pyramus.rest.model.TransferCredit[].class);
    if (transferCredits == null) {
      return Collections.emptyList();
    }
    
    List<TransferCredit> result = new ArrayList<>();
    
    for (fi.otavanopisto.pyramus.rest.model.TransferCredit transferCredit : transferCredits) {
      result.add(entityFactory.createEntity(transferCredit));
    }
    
    return Collections.unmodifiableList(result);
  }

  private void updateParticipationTypeByGrade(Long courseStudentId, Long courseId, Grade grade) {
    Long participationTypeId = courseParticipationTypeEvaluationMapper.getParticipationTypeId(grade);
    if (participationTypeId != null) {
      CourseStudent courseStudent = pyramusClient.get(String.format("/courses/courses/%d/students/%d", courseId, courseStudentId), CourseStudent.class);
      if (courseStudent != null) {
        if (!participationTypeId.equals(courseStudent.getParticipationTypeId())) {
          courseStudent.setParticipationTypeId(participationTypeId);
          pyramusClient.put(String.format("/courses/courses/%d/students/%d", courseId, courseStudentId), courseStudent);
        }
      } else {
        logger.severe(String.format("Could not change course participation type because course student %d could not be found", courseStudentId));
      }
    }
  }

}
