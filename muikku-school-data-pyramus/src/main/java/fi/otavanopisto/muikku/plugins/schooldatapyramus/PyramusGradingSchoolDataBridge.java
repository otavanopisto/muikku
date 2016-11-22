package fi.otavanopisto.muikku.plugins.schooldatapyramus;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusCompositeGrade;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusCompositeGradingScale;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusGradingScale;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusGradingScaleItem;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusSchoolDataEntityFactory;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.PyramusClient;
import fi.otavanopisto.muikku.schooldata.GradingSchoolDataBridge;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeInternalException;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.CompositeGrade;
import fi.otavanopisto.muikku.schooldata.entity.CompositeGradingScale;
import fi.otavanopisto.muikku.schooldata.entity.CompositeAssessmentRequest;
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
  public List<CompositeGradingScale> listCompositeGradingScales() {
    List<CompositeGradingScale> localGradingScales = new ArrayList<fi.otavanopisto.muikku.schooldata.entity.CompositeGradingScale>();
    fi.otavanopisto.pyramus.rest.model.composite.CompositeGradingScale[] restGradingScales = pyramusClient.get(
        "/composite/gradingScales/",
        fi.otavanopisto.pyramus.rest.model.composite.CompositeGradingScale[].class);
    for (int i = 0; i < restGradingScales.length; i++) {
      List<CompositeGrade> localGrades = new ArrayList<CompositeGrade>();
      List<fi.otavanopisto.pyramus.rest.model.composite.CompositeGrade> restGrades = restGradingScales[i].getGrades();
      for (fi.otavanopisto.pyramus.rest.model.composite.CompositeGrade restGrade : restGrades) {
        SchoolDataIdentifier gradeIdentifier = identifierMapper.getGradeIdentifier(restGrade.getGradeId());
        localGrades.add(new PyramusCompositeGrade(gradeIdentifier.getIdentifier(), restGrade.getGradeName()));
      }
      SchoolDataIdentifier gradingScaleIdentifier = identifierMapper.getGradingScaleIdentifier(restGradingScales[i].getScaleId());
      localGradingScales.add(new PyramusCompositeGradingScale(
        gradingScaleIdentifier.getIdentifier(),
        restGradingScales[i].getScaleName(),
        localGrades));
    }
    return localGradingScales;
  }

	@Override
	public GradingScale findGradingScale(String identifier) {
		if (!NumberUtils.isNumber(identifier)) {
			throw new SchoolDataBridgeInternalException("Identifier has to be numeric");
		}

    return createGradingScaleEntity(pyramusClient.get("/common/gradingScales/" + identifier, fi.otavanopisto.pyramus.rest.model.GradingScale.class));
	}

	@Override
	public List<GradingScale> listGradingScales() {
	  fi.otavanopisto.pyramus.rest.model.GradingScale[] gradingScales = pyramusClient.get("/common/gradingScales/?filterArchived=true", fi.otavanopisto.pyramus.rest.model.GradingScale[].class);
    return createGradingScaleEntities(gradingScales);
	}

	@Override
	public GradingScaleItem findGradingScaleItem(String gradingScaleIdentifier, String identifier) {
		if (!NumberUtils.isNumber(identifier) || !NumberUtils.isNumber(gradingScaleIdentifier)) {
			throw new SchoolDataBridgeInternalException("Identifier has to be numeric");
		}

    return createGradingScaleItemEntity(pyramusClient.get("/common/gradingScales/" + gradingScaleIdentifier + "/grades/" + identifier, fi.otavanopisto.pyramus.rest.model.Grade.class));
	}

	@Override
	public List<GradingScaleItem> listGradingScaleItems(String gradingScaleIdentifier) {
    Grade[] grades = pyramusClient.get("/common/gradingScales/" + gradingScaleIdentifier + "/grades", Grade[].class);
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

    if (grades != null) {
      for (Grade g : grades)
        result.add(createGradingScaleItemEntity(g));
    }
      
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

    if (gradingScales != null) {
      for (fi.otavanopisto.pyramus.rest.model.GradingScale g : gradingScales)
        result.add(createGradingScaleEntity(g));
    }
      
    return result;
  }

  @Override
  public WorkspaceAssessment createWorkspaceAssessment(String workspaceUserIdentifier, String workspaceUserSchoolDataSource, String workspaceIdentifier, String studentIdentifier, String assessingUserIdentifier,
      String assessingUserSchoolDataSource, String gradeIdentifier, String gradeSchoolDataSource, String gradingScaleIdentifier, String gradingScaleSchoolDataSource, String verbalAssessment, Date date) {

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
    
    CourseAssessment courseAssessment = new CourseAssessment(null, courseStudentId, gradeId, gradingScaleId, assessingUserId, fromDateToOffsetDateTime(date), verbalAssessment, grade.getPassingGrade());
    WorkspaceAssessment workspaceAssessment = entityFactory.createEntity(pyramusClient.post(String.format("/students/students/%d/courses/%d/assessments/", studentId, courseId ), courseAssessment));
    updateParticipationTypeByGrade(courseStudentId, courseId, grade);
    
    return workspaceAssessment;
  }

  @Override
  public WorkspaceAssessment findWorkspaceAssessment(String identifier, String workspaceIdentifier, String studentIdentifier) {
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    Long id = identifierMapper.getPyramusCourseAssessmentId(identifier);
    
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
      Date date) {

    Long courseStudentId = identifierMapper.getPyramusCourseStudentId(workspaceUserIdentifier);
    Long assessingUserId = identifierMapper.getPyramusStaffId(assessingUserIdentifier);
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    Long id = identifierMapper.getPyramusCourseAssessmentId(identifier);
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
    
    CourseAssessment courseAssessment = new CourseAssessment(id, courseStudentId, gradeId, gradingScaleId, assessingUserId, fromDateToOffsetDateTime(date), verbalAssessment, grade.getPassingGrade());
    updateParticipationTypeByGrade(courseStudentId, courseId, grade);
    
    return entityFactory.createEntity(pyramusClient.put(String.format("/students/students/%d/courses/%d/assessments/%d", studentId, courseId, id), courseAssessment));
  }

  @Override
  public List<WorkspaceAssessment> listWorkspaceAssessments(String workspaceIdentifier, String studentIdentifier) {
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
  public void deleteWorkspaceAssessment(SchoolDataIdentifier workspaceIdentifier,
      SchoolDataIdentifier studentIdentifier, SchoolDataIdentifier workspaceAssesmentIdentifier) {
    
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier.getIdentifier());
    if (courseId == null) {
      logger.severe(String.format("Unable to resolve workspace %s", workspaceIdentifier.getIdentifier()));
      return;
    }
    
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());
    if (studentId == null) {
      logger.severe(String.format("Unable to resolve student %s", studentIdentifier.getIdentifier()));
      return;
    }
    
    Long id = identifierMapper.getPyramusCourseAssessmentId(workspaceAssesmentIdentifier.getIdentifier());
    if (id == null) {
      logger.severe(String.format("Could not translate %s to Pyramus assessment", workspaceAssesmentIdentifier.getIdentifier()));
      return; 
    }
    
    pyramusClient.delete(String.format("/students/students/%d/courses/%d/assessments/%s", studentId, courseId, id));
  }

  @Override
  public WorkspaceAssessmentRequest createWorkspaceAssessmentRequest(String workspaceUserIdentifier,
      String workspaceUserSchoolDataSource, String workspaceIdentifier, String studentIdentifier, String requestText,
      Date date) {
    Long courseStudentId = identifierMapper.getPyramusCourseStudentId(workspaceUserIdentifier);
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    if (courseStudentId == null || courseId == null || studentId == null) {
      logger.severe(String.format("Unable to resolve workspace user %s workspace %s or student %s", workspaceUserIdentifier, workspaceIdentifier, studentIdentifier));
      return null;
    }
    else {
      CourseAssessmentRequest courseAssessmentRequest = new CourseAssessmentRequest(null, courseStudentId, fromDateToOffsetDateTime(date), requestText, Boolean.FALSE, Boolean.FALSE);
      return entityFactory.createEntity(pyramusClient.post(String.format("/students/students/%d/courses/%d/assessmentRequests/", studentId, courseId), courseAssessmentRequest));
    }
  }

  @Override
  public WorkspaceAssessmentRequest findWorkspaceAssessmentRequest(String identifier, String workspaceIdentifier,
      String studentIdentifier) {
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
  public List<WorkspaceAssessmentRequest> listWorkspaceAssessmentRequests(String workspaceIdentifier) {
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    if (courseId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus course", workspaceIdentifier));
      return null; 
    }
    return entityFactory.createEntity(pyramusClient.get(String.format("/courses/courses/%d/assessmentsRequests/?activeStudents=true", courseId), CourseAssessmentRequest[].class));
  }

  @Override
  public List<WorkspaceAssessmentRequest> listWorkspaceAssessmentRequests(String workspaceIdentifier,
      String studentIdentifier) {
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
  public List<WorkspaceAssessmentRequest> listAssessmentRequestsByStudent(String studentIdentifier) {
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    if (studentId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus student", studentIdentifier));
      return null; 
    }
    return entityFactory.createEntity(pyramusClient.get(String.format("/students/students/%d/assessmentRequests/", studentId), CourseAssessmentRequest[].class));
  }
  
  public List<CompositeAssessmentRequest> listCompositeAssessmentRequestsByWorkspace(String workspaceIdentifier) {
    return listCompositeAssessmentRequestsByWorkspace(workspaceIdentifier, new ArrayList<String>());
  }

  public List<CompositeAssessmentRequest> listCompositeAssessmentRequestsByWorkspace(String workspaceIdentifier, List<String> workspaceStudentIdentifiers) {
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    if (courseId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus course", workspaceIdentifier));
      return null; 
    }
    StringBuffer courseStudentIds = new StringBuffer();
    for (String workspaceStudentIdentifier : workspaceStudentIdentifiers) {
      if (courseStudentIds.length() > 0) {
        courseStudentIds.append(",");
      }
      courseStudentIds.append(identifierMapper.getPyramusCourseStudentId(workspaceStudentIdentifier));
    }
    fi.otavanopisto.pyramus.rest.model.composite.CompositeAssessmentRequest[] compositeAssessmentRequests = pyramusClient.get(
        String.format("/composite/course/%d/assessmentRequests?courseStudentIds=%s", courseId, courseStudentIds),
        fi.otavanopisto.pyramus.rest.model.composite.CompositeAssessmentRequest[].class); 
    return entityFactory.createEntity(compositeAssessmentRequests);
  }
  
  public List<CompositeAssessmentRequest> listCompositeAssessmentRequestsByStaffMember(String identifier) {
    Long staffMemberId = identifierMapper.getPyramusStaffId(identifier);
    if (staffMemberId == null) {
      logger.severe(String.format("Could not translate %s to Pyramus staff member", identifier));
      return null; 
    }
    fi.otavanopisto.pyramus.rest.model.composite.CompositeAssessmentRequest[] compositeAssessmentRequests = pyramusClient.get(
        String.format("/composite/staffMembers/%d/assessmentRequests/", staffMemberId),
        fi.otavanopisto.pyramus.rest.model.composite.CompositeAssessmentRequest[].class); 
    return entityFactory.createEntity(compositeAssessmentRequests);
  }
  
  @Override
  public WorkspaceAssessmentRequest updateWorkspaceAssessmentRequest(String identifier, String workspaceUserIdentifier,
      String workspaceUserSchoolDataSource, String workspaceIdentifier, String studentIdentifier,
      String requestText, Date date) {
    Long courseStudentId = identifierMapper.getPyramusCourseStudentId(workspaceUserIdentifier);
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    Long id = NumberUtils.createLong(identifier);
    
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
    
    CourseAssessmentRequest courseAssessmentRequest = new CourseAssessmentRequest(id, courseStudentId, fromDateToOffsetDateTime(date), requestText, Boolean.FALSE, Boolean.FALSE);
    return entityFactory.createEntity(pyramusClient.put(String.format("/students/students/%d/courses/%d/assessmentRequests/%d", studentId, courseId, id), courseAssessmentRequest));
  }

  @Override
  public void deleteWorkspaceAssessmentRequest(String identifier, String workspaceIdentifier, String studentIdentifier) {
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
  
  private OffsetDateTime fromDateToOffsetDateTime(Date date) {
	Instant instant = date.toInstant();
	ZoneId systemId = ZoneId.systemDefault();
	ZoneOffset offset = systemId.getRules().getOffset(instant);
    return date.toInstant().atOffset(offset);
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
