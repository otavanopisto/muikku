package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.workspace.EducationTypeMapping;
import fi.otavanopisto.muikku.model.workspace.Mandatority;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.otavanopisto.muikku.plugins.guider.GuiderController;
import fi.otavanopisto.muikku.plugins.guider.GuiderStudentWorkspaceActivity;
import fi.otavanopisto.muikku.plugins.guider.GuiderStudentWorkspaceActivityRestModel;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.rest.ToRWorkspaceRestModel;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceEntityFileController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceVisitController;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.CourseLengthUnit;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentState;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceSubject;
import fi.otavanopisto.muikku.search.IndexedWorkspace;
import fi.otavanopisto.muikku.search.IndexedWorkspaceSubject;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

public class WorkspaceRestModels {

  @Inject
  private CourseMetaController courseMetaController;
  
  @Inject
  private GuiderController guiderController;
  
  @Inject
  private AssessmentRequestController assessmentRequestController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private WorkspaceVisitController workspaceVisitController;
  
  @Inject
  private WorkspaceEntityFileController workspaceEntityFileController;

  public ToRWorkspaceRestModel createRestModelWithActivity(SchoolDataIdentifier userIdentifier, WorkspaceEntity workspaceEntity, fi.otavanopisto.muikku.schooldata.entity.Workspace workspace, EducationTypeMapping educationTypeMapping) {
    Long numVisits = workspaceVisitController.getNumVisits(workspaceEntity);
    Date lastVisit = workspaceVisitController.getLastVisit(workspaceEntity);
    boolean hasCustomImage = workspaceEntityFileController.getHasCustomImage(workspaceEntity);

    GuiderStudentWorkspaceActivity activity = guiderController.getStudentWorkspaceActivity(workspaceEntity, userIdentifier);
    List<WorkspaceAssessmentState> assessmentStates = new ArrayList<>();
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndUserIdentifier(workspaceEntity, userIdentifier);
    if (workspaceUserEntity != null && workspaceUserEntity.getWorkspaceUserRole().getArchetype() == WorkspaceRoleArchetype.STUDENT) {
      assessmentStates = assessmentRequestController.getAllWorkspaceAssessmentStates(workspaceUserEntity);
    }
    
    Set<String> curriculumIdentifiers = workspace.getCurriculumIdentifiers().stream()
        .map(identifier -> identifier.toId())
        .collect(Collectors.toSet());

    List<WorkspaceSubjectRestModel> subjectRestModels = workspace.getSubjects().stream()
        .map(workspaceSubject -> toRestModel(workspaceSubject))
        .collect(Collectors.toList());
    
    GuiderStudentWorkspaceActivityRestModel guiderStudentWorkspaceActivityRestModel = toRestModel(activity, assessmentStates);
    
    Mandatority mandatority = (educationTypeMapping != null && workspace.getEducationSubtypeIdentifier() != null) 
        ? educationTypeMapping.getMandatority(workspace.getEducationSubtypeIdentifier()) : null;
    
    return new ToRWorkspaceRestModel(workspaceEntity.getId(),
        workspaceEntity.getOrganizationEntity() == null ? null : workspaceEntity.getOrganizationEntity().getId(),
        workspaceEntity.getUrlName(),
        workspaceEntity.getAccess(),
        workspaceEntity.getArchived(), 
        workspaceEntity.getPublished(),
        workspaceEntity.getLanguage(),
        workspace.getName(), 
        workspace.getNameExtension(), 
        workspace.getDescription(), 
        workspaceEntity.getDefaultMaterialLicense(),
        mandatority,
        numVisits, 
        lastVisit,
        curriculumIdentifiers,
        hasCustomImage,
        subjectRestModels,
        guiderStudentWorkspaceActivityRestModel);
  }
  
  public ToRWorkspaceRestModel createRestModelWithActivity(SchoolDataIdentifier userIdentifier, IndexedWorkspace indexedWorkspace, EducationTypeMapping educationTypeMapping) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByIdentifier(indexedWorkspace.getIdentifier());
    
    Long numVisits = workspaceVisitController.getNumVisits(workspaceEntity);
    Date lastVisit = workspaceVisitController.getLastVisit(workspaceEntity);
    boolean hasCustomImage = workspaceEntityFileController.getHasCustomImage(workspaceEntity);

    GuiderStudentWorkspaceActivity activity = guiderController.getStudentWorkspaceActivity(workspaceEntity, userIdentifier);
    List<WorkspaceAssessmentState> assessmentStates = new ArrayList<>();
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndUserIdentifier(workspaceEntity, userIdentifier);
    if (workspaceUserEntity != null && workspaceUserEntity.getWorkspaceUserRole().getArchetype() == WorkspaceRoleArchetype.STUDENT) {
      assessmentStates = assessmentRequestController.getAllWorkspaceAssessmentStates(workspaceUserEntity);
    }
    
    Set<String> curriculumIdentifiers = indexedWorkspace.getCurriculumIdentifiers().stream()
      .map(identifier -> identifier.toId())
      .collect(Collectors.toSet());

    List<WorkspaceSubjectRestModel> subjectRestModels = indexedWorkspace.getSubjects().stream()
        .map(workspaceSubject -> toRestModel(workspaceSubject))
        .collect(Collectors.toList());
    
    GuiderStudentWorkspaceActivityRestModel guiderStudentWorkspaceActivityRestModel = toRestModel(activity, assessmentStates);
    
    Mandatority mandatority = (educationTypeMapping != null && indexedWorkspace.getEducationSubtypeIdentifier() != null) 
        ? educationTypeMapping.getMandatority(indexedWorkspace.getEducationSubtypeIdentifier()) : null;
    
    return new ToRWorkspaceRestModel(workspaceEntity.getId(),
        workspaceEntity.getOrganizationEntity() == null ? null : workspaceEntity.getOrganizationEntity().getId(),
        workspaceEntity.getUrlName(),
        workspaceEntity.getAccess(),
        workspaceEntity.getArchived(), 
        workspaceEntity.getPublished(), 
        workspaceEntity.getLanguage(),
        indexedWorkspace.getName(), 
        indexedWorkspace.getNameExtension(), 
        indexedWorkspace.getDescription(), 
        workspaceEntity.getDefaultMaterialLicense(),
        mandatority,
        numVisits, 
        lastVisit,
        curriculumIdentifiers,
        hasCustomImage,
        subjectRestModels,
        guiderStudentWorkspaceActivityRestModel);
  }
  
  public WorkspaceSubjectRestModel toRestModel(IndexedWorkspaceSubject workspaceSubject) {
    Subject subjectObject = courseMetaController.findSubject(workspaceSubject.getSubjectIdentifier());
    SubjectRestModel subject = subjectObject != null ? new SubjectRestModel(subjectObject.getIdentifier(), subjectObject.getName(), subjectObject.getCode()) : null;

    WorkspaceLengthUnitRestModel workspaceLengthUnit = null;
    if ((workspaceSubject.getLength() != null) && (workspaceSubject.getLengthUnitIdentifier() != null)) {
      CourseLengthUnit lengthUnit = courseMetaController.findCourseLengthUnit(workspaceSubject.getLengthUnitIdentifier());
      workspaceLengthUnit = lengthUnit != null ? new WorkspaceLengthUnitRestModel(lengthUnit.getIdentifier(), lengthUnit.getSymbol(), lengthUnit.getName()) : null;
    }

    return new WorkspaceSubjectRestModel(workspaceSubject.getIdentifier(), subject, workspaceSubject.getCourseNumber(), workspaceSubject.getLength(), workspaceLengthUnit);
  }
  
  public WorkspaceSubjectRestModel toRestModel(WorkspaceSubject workspaceSubject) {
    Subject subjectObject = workspaceSubject.getSubjectIdentifier() != null ? courseMetaController.findSubject(workspaceSubject.getSubjectIdentifier()) : null;
    SubjectRestModel subject = subjectObject != null ? new SubjectRestModel(subjectObject.getIdentifier(), subjectObject.getName(), subjectObject.getCode()) : null;

    WorkspaceLengthUnitRestModel workspaceLengthUnit = null;
    if ((workspaceSubject.getLength() != null) && (workspaceSubject.getLengthUnitIdentifier() != null)) {
      CourseLengthUnit lengthUnit = courseMetaController.findCourseLengthUnit(workspaceSubject.getLengthUnitIdentifier());
      workspaceLengthUnit = lengthUnit != null ? new WorkspaceLengthUnitRestModel(lengthUnit.getIdentifier(), lengthUnit.getSymbol(), lengthUnit.getName()) : null;
    }

    return new WorkspaceSubjectRestModel(workspaceSubject.getIdentifier(), subject, workspaceSubject.getCourseNumber(), workspaceSubject.getLength(), workspaceLengthUnit);
  }
  
  public GuiderStudentWorkspaceActivityRestModel toRestModel(GuiderStudentWorkspaceActivity activity, List<WorkspaceAssessmentState> assessmentStates) {
    GuiderStudentWorkspaceActivityRestModel model = new GuiderStudentWorkspaceActivityRestModel(
        activity.getLastVisit(),
        activity.getNumVisits(),
        activity.getJournalEntryCount(),
        activity.getLastJournalEntry(),
        activity.getEvaluables().getUnanswered(), 
        activity.getEvaluables().getAnswered(), 
        activity.getEvaluables().getAnsweredLastDate(), 
        activity.getEvaluables().getSubmitted(), 
        activity.getEvaluables().getSubmittedLastDate(), 
        activity.getEvaluables().getWithdrawn(), 
        activity.getEvaluables().getWithdrawnLastDate(), 
        activity.getEvaluables().getPassed(), 
        activity.getEvaluables().getPassedLastDate(), 
        activity.getEvaluables().getFailed(), 
        activity.getEvaluables().getFailedLastDate(),
        activity.getEvaluables().getIncomplete(),
        activity.getEvaluables().getIncompleteLastDate(),
        activity.getExercises().getUnanswered(), 
        activity.getExercises().getAnswered(), 
        activity.getExercises().getAnsweredLastDate(),
        assessmentStates);
    return model;
  }
  
}
