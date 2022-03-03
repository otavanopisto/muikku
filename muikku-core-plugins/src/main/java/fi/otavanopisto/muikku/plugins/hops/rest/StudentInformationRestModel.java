package fi.otavanopisto.muikku.plugins.hops.rest;

import java.util.List;

public class StudentInformationRestModel {
  
  public StudentInformationRestModel(
      Long id,
      String firstName,
      String lastName,
      List<String> counselorList) {
    super();
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.counselorList = counselorList;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }
  
  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public List<String> getCounselorList() {
    return counselorList;
  }

  public void setCounselorList(List<String> counselorList) {
    this.counselorList = counselorList;
  }
  
  private Long id;
  private String firstName;
  private String lastName;
  private List<String> counselorList;
}