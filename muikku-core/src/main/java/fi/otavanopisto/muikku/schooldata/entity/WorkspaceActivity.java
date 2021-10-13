package fi.otavanopisto.muikku.schooldata.entity;

import java.util.Date;
import java.util.List;

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

  public List<String> getCurriculumIdentifiers() {
    return curriculumIdentifiers;
  }

  public void setCurriculumIdentifiers(List<String> curriculumIdentifiers) {
    this.curriculumIdentifiers = curriculumIdentifiers;
  }

  public String getGrade() {
    return grade;
  }

  public void setGrade(String grade) {
    this.grade = grade;
  }

  public Boolean getPassingGrade() {
    return passingGrade;
  }

  public void setPassingGrade(Boolean passingGrade) {
    this.passingGrade = passingGrade;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  public WorkspaceActivityState getState() {
    return state;
  }

  public void setState(WorkspaceActivityState state) {
    this.state = state;
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

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  private Long id;
  private String identifier;
  private String name;
  private List<String> curriculumIdentifiers;
  private String grade;
  private Boolean passingGrade;
  private Date date;
  private String text;
  private WorkspaceActivityState state;
  private Integer exercisesTotal;
  private Integer exercisesAnswered;
  private Integer evaluablesTotal;
  private Integer evaluablesAnswered;

}
