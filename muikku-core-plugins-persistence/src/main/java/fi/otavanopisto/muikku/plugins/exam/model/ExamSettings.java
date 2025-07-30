package fi.otavanopisto.muikku.plugins.exam.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

@Entity
@Table (uniqueConstraints = {@UniqueConstraint(columnNames = {"workspaceFolderId"})})
public class ExamSettings {

  public Long getId() {
    return id;
  }

  public Long getWorkspaceFolderId() {
    return workspaceFolderId;
  }

  public void setWorkspaceFolderId(Long examId) {
    this.workspaceFolderId = examId;
  }

  public String getSettings() {
    return settings;
  }

  public void setSettings(String settings) {
    this.settings = settings;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  @Column(nullable = false)
  private Long workspaceFolderId;

  @NotNull
  @Column(columnDefinition = "mediumtext", nullable = false)
  private String settings; // serialized ExamSettingsRestModel

}
