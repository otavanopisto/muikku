package fi.otavanopisto.muikku.plugins.communicator.rest;


public class CommunicatorUserLabelRESTModel {

  public CommunicatorUserLabelRESTModel() {
  }
  
  public CommunicatorUserLabelRESTModel(Long id, String name, Long color) {
    this.id = id;
    this.name = name;
    this.color = color;
  }

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

  public Long getColor() {
    return color;
  }

  public void setColor(Long color) {
    this.color = color;
  }

  private Long id;
  private String name;
  private Long color;
}
