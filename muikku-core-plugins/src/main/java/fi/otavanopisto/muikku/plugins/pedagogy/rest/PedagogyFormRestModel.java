package fi.otavanopisto.muikku.plugins.pedagogy.rest;

import java.util.Date;
import java.util.List;
import java.util.Map;

import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormState;

public class PedagogyFormRestModel {

  public String getStudentIdentifier() {
    return studentIdentifier;
  }

  public void setStudentIdentifier(String studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
  }

  public String getFormData() {
    return formData;
  }

  public void setFormData(String formData) {
    this.formData = formData;
  }

  public PedagogyFormState getState() {
    return state;
  }

  public void setState(PedagogyFormState state) {
    this.state = state;
  }

  public List<PedagogyFormHistoryRestModel> getHistory() {
    return history;
  }

  public void setHistory(List<PedagogyFormHistoryRestModel> history) {
    this.history = history;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getOwnerId() {
    return ownerId;
  }

  public void setOwnerId(Long ownerId) {
    this.ownerId = ownerId;
  }

  public Map<String, String> getStudentInfo() {
    return studentInfo;
  }

  public void setStudentInfo(Map<String, String> studentInfo) {
    this.studentInfo = studentInfo;
  }

  public Map<String, String> getOwnerInfo() {
    return ownerInfo;
  }

  public void setOwnerInfo(Map<String, String> ownerInfo) {
    this.ownerInfo = ownerInfo;
  }

  private Long id;
  private String studentIdentifier;
  private Map<String, String> studentInfo;
  private Date created;
  private Long ownerId;
  private Map<String, String> ownerInfo;
  private String formData;
  private PedagogyFormState state;
  private List<PedagogyFormHistoryRestModel> history;

}
