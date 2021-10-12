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

  private Long id;
  private String identifier;
  private String name;
  private List<String> curriculumIdentifiers;
  private String grade;
  private Boolean passingGrade;
  private Date date;
  private WorkspaceActivityState state;

}
