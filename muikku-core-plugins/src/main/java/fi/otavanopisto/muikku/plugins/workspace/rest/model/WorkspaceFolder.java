package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import fi.otavanopisto.muikku.model.workspace.WorkspaceLanguage;
import fi.otavanopisto.muikku.plugins.material.model.MaterialViewRestrict;

public class WorkspaceFolder {

  public WorkspaceFolder() {
  }

  public WorkspaceFolder(Long id, Long parentId, Long nextSiblingId, boolean hidden, String title, String path, MaterialViewRestrict viewRestrict, WorkspaceLanguage titleLanguage, boolean exam) {
    super();
    this.id = id;
    this.parentId = parentId;
    this.nextSiblingId = nextSiblingId;
    this.hidden = hidden;
    this.title = title;
    this.path = path;
    this.viewRestrict = viewRestrict;
    this.titleLanguage = titleLanguage;
    this.exam = exam;
  }
  
  public Long getId() {
    return id;
  }
  
  public void setId(Long id) {
    this.id = id;
  }

  public Long getParentId() {
    return parentId;
  }

  public void setParentId(Long parentId) {
    this.parentId = parentId;
  }

  public Long getNextSiblingId() {
    return nextSiblingId;
  }
  
  public void setNextSiblingId(Long nextSiblingId) {
    this.nextSiblingId = nextSiblingId;
  }
  
  public boolean getHidden() {
    return hidden;
  }

  public void setHidden(boolean hidden) {
    this.hidden = hidden;
  }
  
  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getPath() {
    return path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  public MaterialViewRestrict getViewRestrict() {
    return viewRestrict;
  }

  public void setViewRestrict(MaterialViewRestrict viewRestrict) {
    this.viewRestrict = viewRestrict;
  }

  public WorkspaceLanguage getTitleLanguage() {
    return titleLanguage;
  }

  public void setTitleLanguage(WorkspaceLanguage titleLanguage) {
    this.titleLanguage = titleLanguage;
  }

  public boolean getExam() {
    return exam;
  }

  public void setExam(boolean exam) {
    this.exam = exam;
  }

  private Long id;
  private Long parentId;
  private Long nextSiblingId;
  private boolean hidden;
  private String title;
  private String path;
  private MaterialViewRestrict viewRestrict;
  private WorkspaceLanguage titleLanguage;
  private boolean exam;

}