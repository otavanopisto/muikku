package fi.otavanopisto.muikku.plugins.communicator.rest;


public class CommunicatorSearchResultLabelRESTModel {

  public CommunicatorSearchResultLabelRESTModel() {
  }
  
  public CommunicatorSearchResultLabelRESTModel(Long labelId, String labelName, Long labelColor) {
    this.labelId = labelId;
    this.labelName = labelName;
    this.labelColor = labelColor;
  }

  public Long getId() {
    return labelId;
  }

  public void setId(Long labelId) {
    this.labelId = labelId;
  }

  public String getlabelName() {
    return labelName;
  }

  public void setlabelName(String labelName) {
    this.labelName = labelName;
  }

  public Long getlabelColor() {
    return labelColor;
  }

  public void setlabelColor(Long labelColor) {
    this.labelColor = labelColor;
  }

  private Long labelId;
  private String labelName;
  private Long labelColor;
}
