package fi.otavanopisto.muikku.schooldata.entity;

import java.util.List;

import fi.otavanopisto.muikku.model.workspace.Mandatority;

public class WorkspaceActivity {

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  public Integer getExercisesTotal() {
    return exercisesTotal;
  }

  public void setExercisesTotal(Integer exercisesTotal) {
    this.exercisesTotal = exercisesTotal;
  }

  public Integer getExercisesAnswered() {
    return exercisesAnswered;
  }

  public void setExercisesAnswered(Integer exercisesAnswered) {
    this.exercisesAnswered = exercisesAnswered;
  }

  public Integer getEvaluablesTotal() {
    return evaluablesTotal;
  }

  public void setEvaluablesTotal(Integer evaluablesTotal) {
    this.evaluablesTotal = evaluablesTotal;
  }

  public Integer getEvaluablesAnswered() {
    return evaluablesAnswered;
  }

  public void setEvaluablesAnswered(Integer evaluablesAnswered) {
    this.evaluablesAnswered = evaluablesAnswered;
  }

  public List<WorkspaceActivityCurriculum> getCurriculums() {
    return curriculums;
  }

  public void setCurriculums(List<WorkspaceActivityCurriculum> curriculums) {
    this.curriculums = curriculums;
  }

  public List<WorkspaceActivitySubject> getSubjects() {
    return subjects;
  }

  public void setSubjects(List<WorkspaceActivitySubject> subjects) {
    this.subjects = subjects;
  }

  public List<WorkspaceAssessmentState> getAssessmentStates() {
    return assessmentStates;
  }

  public void setAssessmentStates(List<WorkspaceAssessmentState> assessmentStates) {
    this.assessmentStates = assessmentStates;
  }

  public Mandatority getMandatority() {
    return mandatority;
  }

  public void setMandatority(Mandatority mandatority) {
    this.mandatority = mandatority;
  }

  private Long id;
  private String identifier;
  private List<WorkspaceActivitySubject> subjects;
  private List<WorkspaceAssessmentState> assessmentStates;
  private String name;
  private List<WorkspaceActivityCurriculum> curriculums;
  private Integer exercisesTotal;
  private Integer exercisesAnswered;
  private Integer evaluablesTotal;
  private Integer evaluablesAnswered;
  private Mandatority mandatority;

}